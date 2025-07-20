const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Crear nuevo vehículo
router.post('/', async (req, res) => {
  try {
    console.log('📥 Datos recibidos:', req.body);
    
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
      kilometrajeInicial,
      observaciones,
      foto_vehiculo,
      fecha_asignacion,
      fechaAsignacion,
      id_usuario_asignado,
      idUsuarioAsignado
    } = req.body;

    // Mapear campos en ambos formatos
    const fechaAsignacionFinal = fechaAsignacion !== undefined ? fechaAsignacion : fecha_asignacion;
    const usuarioAsignadoFinal = idUsuarioAsignado !== undefined ? idUsuarioAsignado : id_usuario_asignado;
    
    console.log('📅 DEBUG fecha_asignacion:', {
      valor: fechaAsignacionFinal,
      tipo: typeof fechaAsignacionFinal,
      esVacio: fechaAsignacionFinal === '',
      esNull: fechaAsignacionFinal === null,
      esUndefined: fechaAsignacionFinal === undefined
    });

    // Verificar que los campos requeridos estén presentes
    if (!placa || !marca || !modelo || !anio || !color || !numeroSerie || 
        !idTipoVehiculo || !idGrupoVehiculo || !idEstadoVehiculo || !idTipoCombustible) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos requeridos deben estar presentes',
        missing: {
          placa: !placa,
          marca: !marca,
          modelo: !modelo,
          anio: !anio,
          color: !color,
          numeroSerie: !numeroSerie,
          idTipoVehiculo: !idTipoVehiculo,
          idGrupoVehiculo: !idGrupoVehiculo,
          idEstadoVehiculo: !idEstadoVehiculo,
          idTipoCombustible: !idTipoCombustible
        }
      });
    }

    // Procesar fecha de asignación
    let fechaAsignacionProcesada = null;
    if (fechaAsignacionFinal && fechaAsignacionFinal !== '') {
      try {
        const fecha = new Date(fechaAsignacionFinal);
        if (!isNaN(fecha.getTime())) {
          fechaAsignacionProcesada = fecha.toISOString().split('T')[0];
        }
      } catch (error) {
        console.log('Error al procesar fecha:', error);
      }
    }

    const query = `
      INSERT INTO vehiculo (
        placa, marca, modelo, anio, color, numero_serie,
        id_tipo_vehiculo, id_grupo_vehiculo, id_estado_vehiculo,
        id_tipo_combustible, kilometraje_inicial, kilometraje_actual,
        observaciones, foto_vehiculo, fecha_asignacion, id_usuario_asignado, activo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true)
      RETURNING *
    `;

    const values = [
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
      kilometrajeInicial || 0,
      kilometrajeInicial || 0,
      observaciones,
      foto_vehiculo,
      fechaAsignacionProcesada,
      usuarioAsignadoFinal
    ];

    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear vehículo',
      error: error.message
    });
  }
});

// Obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT v.*, tv.nombre as tipo_vehiculo, gv.nombre as grupo_vehiculo,
             ev.nombre as estado_vehiculo, tc.nombre as tipo_combustible,
             (v.fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') as fecha_creacion_local,
             (v.fecha_actualizacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') as fecha_actualizacion_local,
             (v.fecha_asignacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') as fecha_asignacion_local
      FROM vehiculo v
      LEFT JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id
      LEFT JOIN grupo_vehiculo gv ON v.id_grupo_vehiculo = gv.id
      LEFT JOIN estado_vehiculo ev ON v.id_estado_vehiculo = ev.id
      LEFT JOIN tipo_combustible tc ON v.id_tipo_combustible = tc.id
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
             ev.nombre as estado_vehiculo, tc.nombre as tipo_combustible,
             (v.fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') as fecha_creacion_local,
             (v.fecha_actualizacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') as fecha_actualizacion_local,
             (v.fecha_asignacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') as fecha_asignacion_local
      FROM vehiculo v
      LEFT JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id
      LEFT JOIN grupo_vehiculo gv ON v.id_grupo_vehiculo = gv.id
      LEFT JOIN estado_vehiculo ev ON v.id_estado_vehiculo = ev.id
      LEFT JOIN tipo_combustible tc ON v.id_tipo_combustible = tc.id
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
    console.log('🔄 PUT /:id - Actualizando vehículo ID:', req.params.id);
    console.log('📝 Datos recibidos:', req.body);
    
    const { id } = req.params;
    const {
      placa,
      marca,
      modelo,
      anio,
      color,
      numeroSerie,
      kilometrajeActual,
      idTipoVehiculo,
      idGrupoVehiculo,
      idEstadoVehiculo,
      idTipoCombustible,
      observaciones,
      foto_vehiculo,
      fechaAsignacion,
      idUsuarioAsignado
    } = req.body;

    console.log('🔍 DEBUG valores recibidos:', {
      idTipoVehiculo, idGrupoVehiculo, idEstadoVehiculo, idTipoCombustible,
      fechaAsignacion, idUsuarioAsignado
    });

    // DEBUG ESPECÍFICO PARA FECHA
    console.log('📅 DEBUG FECHA BACKEND DETALLADO:', {
      fechaAsignacion: fechaAsignacion,
      tipoFecha: typeof fechaAsignacion,
      esVacio: fechaAsignacion === '',
      esNull: fechaAsignacion === null,
      esUndefined: fechaAsignacion === undefined,
      valorOriginal: req.body.fechaAsignacion
    });

    // Procesar fecha de asignación
    let fechaAsignacionProcesada = null;
    if (fechaAsignacion && fechaAsignacion !== '' && fechaAsignacion !== null) {
      try {
        console.log('⚙️ Procesando fecha:', fechaAsignacion);
        const fecha = new Date(fechaAsignacion);
        if (!isNaN(fecha.getTime())) {
          fechaAsignacionProcesada = fecha.toISOString().split('T')[0];
          console.log('✅ Fecha procesada exitosamente:', fechaAsignacionProcesada);
        } else {
          console.log('❌ Fecha inválida después del new Date()');
        }
      } catch (error) {
        console.log('❌ Error al procesar fecha:', error);
      }
    } else {
      console.log('⚠️ Fecha no procesada (vacía, null o undefined)');
    }

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
        observaciones = $12,
        foto_vehiculo = $13,
        fecha_asignacion = $14,
        id_usuario_asignado = $15,
        fecha_actualizacion = NOW()
      WHERE id = $16 AND activo = true
      RETURNING *
    `;

    const values = [
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
      kilometrajeActual,
      observaciones,
      foto_vehiculo,
      fechaAsignacionProcesada,
      idUsuarioAsignado,
      id
    ];

    console.log('🗄️ Ejecutando query con valores:', values);
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      console.log('❌ Vehículo no encontrado');
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    console.log('✅ Vehículo actualizado:', result.rows[0]);
    res.json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error al actualizar vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar vehículo',
      error: error.message
    });
  }
});

// Eliminar vehículo (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      UPDATE vehiculo SET
        activo = false,
        fecha_actualizacion = NOW()
      WHERE id = $1 AND activo = true
      RETURNING *
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
