const pool = require('./src/config/database');

async function debugVehiculo() {
  try {
    console.log('🔍 Consultando todos los vehículos activos...');
    
    const query = `
      SELECT v.*, tv.nombre as tipo_vehiculo, gv.nombre as grupo_vehiculo,
             ev.nombre as estado_vehiculo, tc.nombre as tipo_combustible
      FROM vehiculo v
      LEFT JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id
      LEFT JOIN grupo_vehiculo gv ON v.id_grupo_vehiculo = gv.id
      LEFT JOIN estado_vehiculo ev ON v.id_estado_vehiculo = ev.id
      LEFT JOIN tipo_combustible tc ON v.id_tipo_combustible = tc.id
      WHERE v.activo = true
      ORDER BY v.id DESC
      LIMIT 5
    `;
    
    const result = await pool.query(query);
    
    console.log('📋 Últimos 5 vehículos:');
    result.rows.forEach(vehiculo => {
      console.log(`ID: ${vehiculo.id}, Placa: ${vehiculo.placa}, Tipo: ${vehiculo.id_tipo_vehiculo}, Grupo: ${vehiculo.id_grupo_vehiculo}, Estado: ${vehiculo.id_estado_vehiculo}, Combustible: ${vehiculo.id_tipo_combustible}`);
    });
    
    console.log('\n🔍 Verificando vehículos con campos nulos...');
    const nullQuery = `
      SELECT id, placa, id_tipo_vehiculo, id_grupo_vehiculo, id_estado_vehiculo, id_tipo_combustible
      FROM vehiculo 
      WHERE activo = true 
      AND (id_tipo_vehiculo IS NULL OR id_grupo_vehiculo IS NULL OR id_estado_vehiculo IS NULL OR id_tipo_combustible IS NULL)
    `;
    
    const nullResult = await pool.query(nullQuery);
    console.log('⚠️  Vehículos con campos nulos:', nullResult.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

debugVehiculo();
