const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener todos los usuarios activos
router.get('/', async (req, res) => {
  try {
    console.log('🔄 GET /api/usuarios - Obteniendo lista de usuarios...');
    
    const query = `
      SELECT id, nombre, apellido, email, telefono, dpi, licencia_conducir
      FROM usuario 
      WHERE activo = true 
      ORDER BY nombre, apellido
    `;
    
    console.log('📝 Ejecutando query:', query);
    const result = await pool.query(query);
    
    console.log(`✅ ${result.rows.length} usuarios encontrados:`, result.rows);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

module.exports = router;
