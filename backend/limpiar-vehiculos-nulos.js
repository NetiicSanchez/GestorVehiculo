const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function limpiarVehiculosNulos() {
  try {
    console.log('🔍 Conectando a PostgreSQL...');
    await pool.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Primero mostrar los vehículos con nulos
    console.log('\n📋 Vehículos con campos nulos antes del cleanup:');
    const vehiculosNulos = await pool.query(`
      SELECT id, placa, id_tipo_vehiculo, id_grupo_vehiculo, id_estado_vehiculo, id_tipo_combustible
      FROM vehiculo 
      WHERE activo = true 
      AND (id_tipo_vehiculo IS NULL OR id_grupo_vehiculo IS NULL OR id_estado_vehiculo IS NULL OR id_tipo_combustible IS NULL)
      ORDER BY id DESC
    `);
    
    console.log(`⚠️  Encontrados ${vehiculosNulos.rows.length} vehículos con campos nulos:`);
    vehiculosNulos.rows.forEach(v => {
      console.log(`ID: ${v.id}, Placa: ${v.placa}, Tipo: ${v.id_tipo_vehiculo}, Grupo: ${v.id_grupo_vehiculo}, Estado: ${v.id_estado_vehiculo}, Combustible: ${v.id_tipo_combustible}`);
    });

    if (vehiculosNulos.rows.length === 0) {
      console.log('✅ No hay vehículos con campos nulos');
      return;
    }

    // Preguntar al usuario si quiere continuar (simulado)
    console.log('\n❓ ¿Proceder con la limpieza? Marcando como inactivos los vehículos con campos nulos...');
    
    // Marcar como inactivos los vehículos con campos nulos
    const result = await pool.query(`
      UPDATE vehiculo 
      SET activo = false, 
          fecha_modificacion = CURRENT_TIMESTAMP,
          observaciones = CASE 
            WHEN observaciones IS NULL THEN 'Marcado como inactivo - campos de referencia nulos'
            ELSE observaciones || ' | Marcado como inactivo - campos de referencia nulos'
          END
      WHERE activo = true 
      AND (id_tipo_vehiculo IS NULL OR id_grupo_vehiculo IS NULL OR id_estado_vehiculo IS NULL OR id_tipo_combustible IS NULL)
    `);

    console.log(`✅ ${result.rowCount} vehículos marcados como inactivos`);

    // Verificar que no queden vehículos activos con campos nulos
    const verificacion = await pool.query(`
      SELECT COUNT(*) as count
      FROM vehiculo 
      WHERE activo = true 
      AND (id_tipo_vehiculo IS NULL OR id_grupo_vehiculo IS NULL OR id_estado_vehiculo IS NULL OR id_tipo_combustible IS NULL)
    `);

    console.log(`🔍 Vehículos activos con campos nulos después del cleanup: ${verificacion.rows[0].count}`);

    // Mostrar estadísticas finales
    const totalActivos = await pool.query('SELECT COUNT(*) as count FROM vehiculo WHERE activo = true');
    const totalInactivos = await pool.query('SELECT COUNT(*) as count FROM vehiculo WHERE activo = false');
    
    console.log('\n📊 Estadísticas finales:');
    console.log(`- Vehículos activos: ${totalActivos.rows[0].count}`);
    console.log(`- Vehículos inactivos: ${totalInactivos.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
    console.log('🔌 Conexión cerrada');
  }
}

limpiarVehiculosNulos();
