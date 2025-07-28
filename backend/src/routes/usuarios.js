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


// Actualizar usuario por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    telefono,
    dpi,
    licencia_conducir,
    fecha_vencimiento_licencia
  } = req.body;
  try {
    const query = `
      UPDATE usuario SET
        nombre = $1,
        apellido = $2,
        telefono = $3,
        dpi = $4,
        licencia_conducir = $5,
        fecha_vencimiento_licencia = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [
      nombre,
      apellido,
      telefono,
      dpi,
      licencia_conducir,
      fecha_vencimiento_licencia,
      id
    ];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, usuario: result.rows[0] });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
  }
});

module.exports = router;
