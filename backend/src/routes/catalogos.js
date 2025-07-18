const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener tipos de vehículos
router.get('/tipos-vehiculo', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_vehiculo WHERE activo = true ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tipos de vehículo:', error);
    res.status(500).json({ error: 'Error al obtener tipos de vehículo' });
  }
});

// Obtener grupos de vehículos
router.get('/grupos-vehiculo', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grupo_vehiculo WHERE activo = true ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener grupos de vehículo:', error);
    res.status(500).json({ error: 'Error al obtener grupos de vehículo' });
  }
});

// Obtener estados de vehículos
router.get('/estados-vehiculo', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estado_vehiculo WHERE activo = true ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener estados de vehículo:', error);
    res.status(500).json({ error: 'Error al obtener estados de vehículo' });
  }
});

// Obtener tipos de combustible
router.get('/tipos-combustible', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_combustible WHERE activo = true ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tipos de combustible:', error);
    res.status(500).json({ error: 'Error al obtener tipos de combustible' });
  }
});

// Agregar tipo de vehículo
router.post('/tipos-vehiculo', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const query = 'INSERT INTO tipo_vehiculo (nombre, descripcion) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [nombre, descripcion]);
    res.status(201).json({
      success: true,
      message: 'Tipo de vehículo creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear tipo de vehículo:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'El tipo de vehículo ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear tipo de vehículo'
    });
  }
});

// Eliminar tipo de vehículo (soft delete)
router.delete('/tipos-vehiculo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE tipo_vehiculo SET activo = false WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de vehículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Tipo de vehículo eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar tipo de vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tipo de vehículo'
    });
  }
});

// Agregar grupo de vehículo
router.post('/grupos-vehiculo', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const query = 'INSERT INTO grupo_vehiculo (nombre, descripcion) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [nombre, descripcion]);
    res.status(201).json({
      success: true,
      message: 'Grupo de vehículo creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear grupo de vehículo:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'El grupo de vehículo ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear grupo de vehículo'
    });
  }
});

// Eliminar grupo de vehículo (soft delete)
router.delete('/grupos-vehiculo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE grupo_vehiculo SET activo = false WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Grupo de vehículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Grupo de vehículo eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar grupo de vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar grupo de vehículo'
    });
  }
});

// Agregar estado de vehículo
router.post('/estados-vehiculo', async (req, res) => {
  try {
    const { nombre, descripcion, color } = req.body;
    const query = 'INSERT INTO estado_vehiculo (nombre, descripcion, color) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [nombre, descripcion, color || 'blue']);
    res.status(201).json({
      success: true,
      message: 'Estado de vehículo creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear estado de vehículo:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'El estado de vehículo ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear estado de vehículo'
    });
  }
});

// Eliminar estado de vehículo (soft delete)
router.delete('/estados-vehiculo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE estado_vehiculo SET activo = false WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Estado de vehículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Estado de vehículo eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar estado de vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar estado de vehículo'
    });
  }
});

// Agregar tipo de combustible
router.post('/tipos-combustible', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const query = 'INSERT INTO tipo_combustible (nombre, descripcion) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [nombre, descripcion]);
    res.status(201).json({
      success: true,
      message: 'Tipo de combustible creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear tipo de combustible:', error);
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'El tipo de combustible ya existe'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al crear tipo de combustible'
    });
  }
});

// Eliminar tipo de combustible (soft delete)
router.delete('/tipos-combustible/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE tipo_combustible SET activo = false WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de combustible no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Tipo de combustible eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar tipo de combustible:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tipo de combustible'
    });
  }
});

module.exports = router;
