
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.dpi, u.licencia_conducir, u.fecha_vencimiento_licencia, r.nombre AS rol
      FROM usuario u
      JOIN rol r ON u.id_rol = r.id
      WHERE u.id = $1 AND u.activo = true
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
  }
});

// Obtener todos los usuarios activos
router.get('/', async (req, res) => {
  try {
    console.log('🔄 GET /api/usuarios - Obteniendo lista de usuarios...');
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.dpi, u.licencia_conducir, u.fecha_vencimiento_licencia, r.nombre AS rol
      FROM usuario u
      JOIN rol r ON u.id_rol = r.id
      WHERE u.activo = true
      ORDER BY u.nombre, u.apellido
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
    fecha_vencimiento_licencia,
    id_rol
  } = req.body;
  try {
    let query, values;
    if (id_rol !== undefined) {
      query = `
        UPDATE usuario SET
          nombre = $1,
          apellido = $2,
          telefono = $3,
          dpi = $4,
          licencia_conducir = $5,
          fecha_vencimiento_licencia = $6,
          id_rol = $7
        WHERE id = $8
        RETURNING *
      `;
      values = [
        nombre,
        apellido,
        telefono,
        dpi,
        licencia_conducir,
        fecha_vencimiento_licencia,
        id_rol,
        id
      ];
    } else {
      query = `
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
      values = [
        nombre,
        apellido,
        telefono,
        dpi,
        licencia_conducir,
        fecha_vencimiento_licencia,
        id
      ];
    }
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
