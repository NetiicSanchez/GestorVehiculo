const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function verificarEstructura() {
  try {
    const query = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'vehiculo' 
        AND column_name = 'fecha_asignacion'
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query);
    console.log('📋 Información de la columna fecha_asignacion:');
    console.table(result.rows);
    
    // También verificar si hay vehículos con fecha de asignación
    const testQuery = `
      SELECT id, placa, fecha_asignacion 
      FROM vehiculo 
      WHERE fecha_asignacion IS NOT NULL
      LIMIT 5;
    `;
    
    const testResult = await pool.query(testQuery);
    console.log('\n📅 Vehículos con fecha de asignación:');
    console.table(testResult.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

verificarEstructura();
