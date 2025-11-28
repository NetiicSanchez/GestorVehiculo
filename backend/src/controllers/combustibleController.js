const db = require('../config/database');

// Obtener todas las cargas de combustible con información de vehículos
const obtenerCargas = async (req, res) => {
  try {
    const { mes, anio, limit, offset } = req.query;
    console.log('⛽ Obteniendo cargas con filtros:', { mes, anio, limit, offset });

    let queryParams = [];
    let whereClauses = ['cc.activo = true'];

    if (mes && anio) {
      queryParams.push(mes, anio);
      whereClauses.push('EXTRACT(MONTH FROM cc.fecha_carga) = $1 AND EXTRACT(YEAR FROM cc.fecha_carga) = $2');
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT 
        cc.*,
        v.placa,
        v.marca,
        v.modelo,
        tc.nombre as tipo_combustible,
        u.nombre as nombre_usuario,
        u.apellido as apellido_usuario
      FROM carga_combustible cc
      LEFT JOIN vehiculo v ON cc.id_vehiculo = v.id
      LEFT JOIN tipo_combustible tc ON cc.id_tipo_combustible = tc.id
      LEFT JOIN usuario u ON cc.id_usuario = u.id
      ${whereString}
      ORDER BY cc.fecha_carga DESC
      ${limit ? `LIMIT $${queryParams.length + 1}` : ''}
      ${offset ? `OFFSET $${queryParams.length + 2}` : ''}
    `;

    if (limit) queryParams.push(limit);
    if (offset) queryParams.push(offset);
    
    const result = await db.query(query, queryParams);
    
    console.log(`✅ ${result.rows.length} cargas encontradas`);
    
    
    const toCamel = s => s.replace(/_([a-z])/g, g => g[1].toUpperCase());
    const mapRow = row => {
      const mapped = {};
      for (const key in row) {
        mapped[toCamel(key)] = row[key];
      }
      return mapped;
    };
    const data = result.rows.map(mapRow);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Error obteniendo cargas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo cargas de combustible',
      error: error.message
    });
  }
};

const getRendimientoVehiculo = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener todas las cargas de un vehículo, ordenadas por kilometraje
    const query = `
      SELECT fecha_carga, kilometraje_actual, galones_cargados 
      FROM carga_combustible 
      WHERE id_vehiculo = $1 AND activo = true
      ORDER BY kilometraje_actual ASC
    `;
    const { rows: cargas } = await db.query(query, [id]);

    if (cargas.length < 2) {
      return res.json({ success: true, data: [] }); // No hay suficientes datos para calcular el rendimiento
    }

    const rendimientoData = [];
    for (let i = 1; i < cargas.length; i++) {
      const cargaAnterior = cargas[i - 1];
      const cargaActual = cargas[i];

      const distanciaRecorrida = cargaActual.kilometraje_actual - cargaAnterior.kilometraje_actual;
      const galonesConsumidos = cargaActual.galones_cargados; // Usar galones de la carga actual

      if (distanciaRecorrida > 0 && galonesConsumidos > 0) {
        const rendimiento = distanciaRecorrida / galonesConsumidos;
        rendimientoData.push({
          fecha: new Date(cargaActual.fecha_carga).toLocaleDateString(),
          rendimiento: parseFloat(rendimiento.toFixed(2))
        });
      }
    }

    res.json({ success: true, data: rendimientoData });
  } catch (error) {
    console.error(`Error al calcular el rendimiento para el vehículo ${id}:`, error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getGastosCombustiblePorVehiculo = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT TO_CHAR(fecha_carga, 'YYYY-MM-DD') as fecha_carga, total_pagado AS costo_total
      FROM carga_combustible
      WHERE id_vehiculo = $1 AND activo = true
      ORDER BY fecha_carga ASC
    `;
    const { rows } = await db.query(query, [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(`Error al obtener gastos para el vehículo ${id}:`, error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Obtener cargas por vehículo específico
const obtenerCargasPorVehiculo = async (req, res) => {
  try {
    const { idVehiculo } = req.params;
    console.log(`⛽ Obteniendo cargas del vehículo ${idVehiculo}`);
    
    const query = `
      SELECT 
        cc.*,
        v.placa,
        v.marca,
        v.modelo,
        tc.nombre as tipo_combustible
      FROM carga_combustible cc
      LEFT JOIN vehiculo v ON cc.id_vehiculo = v.id
      LEFT JOIN tipo_combustible tc ON cc.id_tipo_combustible = tc.id
      WHERE cc.id_vehiculo = $1 AND cc.activo = true
      ORDER BY cc.fecha_carga DESC
    `;
    
    const result = await db.query(query, [idVehiculo]);
    
    console.log(`✅ ${result.rows.length} cargas encontradas para vehículo ${idVehiculo}`);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo cargas por vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo cargas del vehículo',
      error: error.message
    });
  }
};

// Registrar nueva carga de combustible
const registrarCarga = async (req, res) => {
  try {
    const {
      id_vehiculo,
      id_tipo_combustible,
      fecha_carga,
      galones_cargados,
      precio_galon,
      total_pagado,
      kilometraje_actual,
      proveedor_combustible,
      numero_factura,
      observaciones,
      foto_factura
    } = req.body;

    console.log('⛽ Registrando nueva carga:', req.body);

    // Validaciones básicas
    if (!id_vehiculo || !galones_cargados || !precio_galon) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: id_vehiculo, galones_cargados, precio_galon'
      });
    }

    const query = `
      INSERT INTO carga_combustible (
        id_vehiculo, id_usuario, id_tipo_combustible, fecha_carga,
        kilometraje_actual, galones_cargados, precio_galon, total_pagado,
        proveedor_combustible, numero_factura, observaciones, foto_factura, activo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      id_vehiculo,
      req.body.id_usuario || null, // Si tienes usuario en sesión
      id_tipo_combustible || null,
      fecha_carga || new Date(),
      kilometraje_actual || 0,
      galones_cargados,
      precio_galon,
      total_pagado || (galones_cargados * precio_galon),
      proveedor_combustible || null,
      numero_factura || null,
      observaciones || null,
      foto_factura || null,
      true
    ];

    const result = await db.query(query, values);
    const nuevaCarga = result.rows[0];

    console.log('✅ Carga registrada exitosamente:', nuevaCarga);

    res.status(201).json({
      success: true,
      message: 'Carga de combustible registrada exitosamente',
      data: nuevaCarga
    });
  } catch (error) {
    console.error('❌ Error registrando carga:', error);
    res.status(500).json({
      success: false,
      message: 'Error registrando carga de combustible',
      error: error.message
    });
  }
};

// Actualizar carga de combustible
const actualizarCarga = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      id_vehiculo,
      id_tipo_combustible,
      fecha_carga,
      galones_cargados,
      precio_galon,
      total_pagado,
      kilometraje_actual,
      proveedor_combustible,
      numero_factura,
      observaciones,
      foto_factura
    } = req.body;

    // Convertir undefined a null para evitar errores
    id_vehiculo = (id_vehiculo === undefined) ? null : id_vehiculo;
    id_tipo_combustible = (id_tipo_combustible === undefined) ? null : id_tipo_combustible;
    fecha_carga = (fecha_carga === undefined) ? null : fecha_carga;
    galones_cargados = (galones_cargados === undefined) ? null : galones_cargados;
    precio_galon = (precio_galon === undefined) ? null : precio_galon;
    total_pagado = (total_pagado === undefined) ? null : total_pagado;
    kilometraje_actual = (kilometraje_actual === undefined) ? null : kilometraje_actual;
    proveedor_combustible = (proveedor_combustible === undefined) ? null : proveedor_combustible;
    numero_factura = (numero_factura === undefined) ? null : numero_factura;
    observaciones = (observaciones === undefined) ? null : observaciones;
    foto_factura = (foto_factura === undefined) ? null : foto_factura;

    console.log(`🔧 Actualizando carga ${id}:`, req.body);

    const query = `
      UPDATE carga_combustible 
      SET 
        id_vehiculo = $1,
        id_tipo_combustible = $2,
        fecha_carga = $3,
        kilometraje_actual = $4,
        galones_cargados = $5,
        precio_galon = $6,
        total_pagado = $7,
        proveedor_combustible = $8,
        numero_factura = $9,
        observaciones = $10,
        foto_factura = $11
      WHERE id = $12 AND activo = true
      RETURNING *
    `;

    const values = [
      id_vehiculo,
      id_tipo_combustible,
      fecha_carga,
      kilometraje_actual,
      galones_cargados,
      precio_galon,
      total_pagado || (galones_cargados * precio_galon),
      proveedor_combustible,
      numero_factura,
      observaciones,
      foto_factura,
      id
    ];

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carga no encontrada'
      });
    }
    
    console.log('✅ Carga actualizada exitosamente:', result.rows[0]);
    
    res.json({
      success: true,
      message: 'Carga actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error actualizando carga:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando carga',
      error: error.message
    });
  }
};

// Eliminar carga (soft delete)
const eliminarCarga = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando carga ${id}`);

    const query = `
      UPDATE carga_combustible 
      SET activo = false 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carga no encontrada'
      });
    }
    
    console.log('✅ Carga eliminada exitosamente');
    
    res.json({
      success: true,
      message: 'Carga eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando carga:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando carga',
      error: error.message
    });
  }
};

// Obtener estadísticas de combustible
const obtenerEstadisticas = async (req, res) => {
  try {
    console.log('📊 Calculando estadísticas de combustible');
    
    const query = `
      SELECT 
        COUNT(*) as total_cargas,
        SUM(galones_cargados) as total_galones,
        SUM(total_pagado) as total_gasto,
        AVG(galones_cargados) as promedio_galones,
        AVG(precio_galon) as precio_promedio,
        MAX(fecha_carga) as ultima_carga,
        MIN(fecha_carga) as primera_carga
      FROM carga_combustible 
      WHERE activo = true
    `;
    
    const result = await db.query(query);
    const stats = result.rows[0];
    
    console.log('✅ Estadísticas calculadas:', stats);
    
    res.json({
      success: true,
      data: {
        totalLitros: parseFloat(stats.total_galones) * 3.78541 || 0, // Convertir galones a litros
        totalGasto: parseFloat(stats.total_gasto) || 0,
        promedioLitros: parseFloat(stats.promedio_galones) * 3.78541 || 0,
        rendimientoPromedio: 12.5, // Placeholder - calcular según kilometraje
        totalCargas: parseInt(stats.total_cargas) || 0,
        precioPromedio: parseFloat(stats.precio_promedio) || 0,
        ultimaCarga: stats.ultima_carga,
        primeraCarga: stats.primera_carga
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
};

module.exports = {
  obtenerCargas,
  obtenerCargasPorVehiculo,
  registrarCarga,
  actualizarCarga,
  eliminarCarga,
  obtenerEstadisticas,
  getRendimientoVehiculo,
  getGastosCombustiblePorVehiculo
};
