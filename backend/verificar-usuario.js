const pool = require('./src/config/database');

async function verificarTablaUsuario() {
  try {
    console.log('🔍 Verificando estructura de la tabla usuario...');
    
    const query = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'usuario'
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query);
    console.log('📋 Columnas de la tabla usuario:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

verificarTablaUsuario();
