const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function actualizarColumna() {
  try {
    console.log('🔧 Cambiando tipo de columna fecha_asignacion de date a timestamp...');
    
    const query = `
      ALTER TABLE vehiculo 
      ALTER COLUMN fecha_asignacion TYPE timestamp;
    `;
    
    await pool.query(query);
    console.log('✅ Columna fecha_asignacion actualizada correctamente');
    
    // Verificar el cambio
    const verificar = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'vehiculo' 
        AND column_name = 'fecha_asignacion';
    `;
    
    const result = await pool.query(verificar);
    console.log('\n📋 Nueva estructura:');
    console.table(result.rows);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

actualizarColumna();
