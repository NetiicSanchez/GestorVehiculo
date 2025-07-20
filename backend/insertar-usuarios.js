const pool = require('./src/config/database');

async function insertarUsuarios() {
  try {
    console.log('👥 Insertando usuarios de prueba...');
    
    const query = `
      INSERT INTO usuario (nombre, apellido, email, telefono, dpi, licencia_conducir) VALUES 
      ('Juan', 'Pérez', 'juan@emp.com', '12345', '1234567890101', 'LC001'),
      ('María', 'González', 'maria@emp.com', '12346', '1234567890102', 'LC002'),
      ('Carlos', 'Rodríguez', 'carlos@emp.com', '12347', '1234567890103', 'LC003'),
      ('Ana', 'Martínez', 'ana@emp.com', '12348', '1234567890104', 'LC004'),
      ('Luis', 'López', 'luis@emp.com', '12349', '1234567890105', 'LC005')
      RETURNING *;
    `;
    
    const result = await pool.query(query);
    console.log(`✅ ${result.rows.length} usuarios insertados:`, result.rows);
    
  } catch (error) {
    console.error('❌ Error al insertar usuarios:', error);
  } finally {
    process.exit(0);
  }
}

insertarUsuarios();
