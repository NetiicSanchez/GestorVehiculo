const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Crear nuevo vehículo
router.post('/', async (req, res) => {
  try {
    const {
      placa,
      marca,
      modelo,
      anio,
      color,
      numeroSerie,
      idTipoVehiculo,
      idGrupoVehiculo,
      idEstadoVehiculo,
      idTipoCombustible,
      kilometrajeInicial
    } = req.body;

    const query = `
      INSERT INTO vehiculo (
        placa, marca, modelo, anio, color, numero_serie,
        id_tipo_vehiculo, id_grupo_vehiculo, id_estado_vehiculo,
        id_tipo_combustible, kilometraje_inicial, kilometraje_actual, activo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, true)
      RETURNING *
    `;

    const values = [
      placa, marca, modelo, anio, color, numeroSerie,
      idTipoVehiculo, idGrupoVehiculo, idEstadoVehiculo,
      idTipoCombustible, kilometrajeInicial || 0
    ];

    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    
    if (error.code === '23505') { // Violación de clave única
      return res.status(400).json({
        success: false,
        message: 'La placa ya existe'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Verificar si placa existe
router.get('/verificar-placa/:placa', async (req, res) => {
  try {
    const { placa } = req.params;
    
    const query = 'SELECT id FROM vehiculo WHERE placa = $1';
    const result = await pool.query(query, [placa]);
    
    res.json({
      existe: result.rows.length > 0
    });
  } catch (error) {
    console.error('Error al verificar placa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar placa'
    });
  }
});

// Obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT v.*, tv.nombre as tipo_vehiculo, gv.nombre as grupo_vehiculo,
             ev.nombre as estado_vehiculo, tc.nombre as tipo_combustible
      FROM vehiculo v
      JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id
      JOIN grupo_vehiculo gv ON v.id_grupo_vehiculo = gv.id
      JOIN estado_vehiculo ev ON v.id_estado_vehiculo = ev.id
      JOIN tipo_combustible tc ON v.id_tipo_combustible = tc.id
      WHERE v.activo = true
      ORDER BY v.fecha_creacion DESC
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos'
    });
  }
});

// Obtener vehículo por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT v.*, tv.nombre as tipo_vehiculo, gv.nombre as grupo_vehiculo,
             ev.nombre as estado_vehiculo, tc.nombre as tipo_combustible
      FROM vehiculo v
      JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id
      JOIN grupo_vehiculo gv ON v.id_grupo_vehiculo = gv.id
      JOIN estado_vehiculo ev ON v.id_estado_vehiculo = ev.id
      JOIN tipo_combustible tc ON v.id_tipo_combustible = tc.id
      WHERE v.id = $1 AND v.activo = true
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículo'
    });
  }
});

// Actualizar vehículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      placa,
      marca,
      modelo,
      anio,
      color,
      numeroSerie,
      idTipoVehiculo,
      idGrupoVehiculo,
      idEstadoVehiculo,
      idTipoCombustible,
      kilometrajeActual
    } = req.body;

    const query = `
      UPDATE vehiculo SET
        placa = $1,
        marca = $2,
        modelo = $3,
        anio = $4,
        color = $5,
        numero_serie = $6,
        id_tipo_vehiculo = $7,
        id_grupo_vehiculo = $8,
        id_estado_vehiculo = $9,
        id_tipo_combustible = $10,
        kilometraje_actual = $11,
        fecha_actualizacion = NOW()
      WHERE id = $12 AND activo = true
      RETURNING *
    `;

    const values = [
      placa, marca, modelo, anio, color, numeroSerie,
      idTipoVehiculo, idGrupoVehiculo, idEstadoVehiculo,
      idTipoCombustible, kilometrajeActual, id
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'La placa ya existe'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar vehículo'
    });
  }
});

// Eliminar vehículo (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE vehiculo SET activo = false WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Vehículo eliminado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar vehículo'
    });
  }
});

module.exports = router;
