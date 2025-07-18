// Crear conexión usando diferentes métodos de autenticación
const { Pool } = require('pg');

const configs = [
  { 
    host: 'localhost', 
    port: 5432, 
    database: 'postgres', 
    user: 'postgres', 
    password: 'gestorvehiculo' 
  },
  { 
    host: 'localhost', 
    port: 5432, 
    database: 'gestor_vehiculos', 
    user: 'postgres', 
    password: 'gestorvehiculo' 
  },
  { 
    host: 'localhost', 
    port: 5432, 
    database: 'postgres', 
    user: 'postgres', 
    password: 'admin' 
  }
];

async function testConnections() {
  for (let i = 0; i < configs.length; i++) {
    console.log(`\n--- Probando configuración ${i + 1} ---`);
    console.log('Config:', configs[i]);
    
    const pool = new Pool(configs[i]);
    
    try {
      const client = await pool.connect();
      console.log('✅ Conexión exitosa!');
      
      // Verificar tablas
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      
      console.log('📋 Tablas encontradas:', tablesResult.rows.map(r => r.table_name));
      
      client.release();
      await pool.end();
      
      console.log('Esta configuración funciona!');
      return configs[i];
      
    } catch (error) {
      console.log('❌ Error:', error.message);
      await pool.end();
    }
  }
  
  console.log('\n❌ Ninguna configuración funcionó');
  return null;
}

testConnections();
