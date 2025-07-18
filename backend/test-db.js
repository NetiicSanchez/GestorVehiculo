const pool = require('./src/config/database');

async function testDatabase() {
  try {
    console.log('Intentando conectar a la base de datos...');
    
    // Verificar conexión
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Verificar si las tablas existen
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas en la base de datos:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verificar tabla tipos_vehiculo específicamente
    const tiposVehiculoResult = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'tipos_vehiculo'
    `);
    
    if (tiposVehiculoResult.rows[0].count > 0) {
      console.log('✅ Tabla tipos_vehiculo existe');
      
      // Verificar contenido de la tabla
      const contentResult = await client.query('SELECT * FROM tipos_vehiculo LIMIT 5');
      console.log('📄 Contenido de tipos_vehiculo:');
      console.log(contentResult.rows);
    } else {
      console.log('❌ Tabla tipos_vehiculo NO existe');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();
