const db = require('../config/database');

// Obtener datos de la vista de gastos de vehículos
const obtenerGastosVehiculos = async (req, res) => {
  try {
    console.log('📊 Obteniendo datos de vista_gasto_vehiculo');
    
    const query = `SELECT * FROM vista_gasto_vehiculo`;
    const result = await db.query(query);
    
    console.log(`✅ ${result.rows.length} registros encontrados en vista_gasto_vehiculo`);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo gastos de vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo datos de gastos de vehículos',
      error: error.message
    });
  }
};

// Obtener datos de la vista del dashboard de vehículos
const obtenerDashboardVehiculos = async (req, res) => {
  try {
    console.log('📊 Obteniendo datos de vista_vehiculos_dashboard');
    
    const query = `SELECT * FROM vista_vehiculos_dashboard`;
    const result = await db.query(query);
    
    console.log(`✅ ${result.rows.length} registros encontrados en vista_vehiculos_dashboard`);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo dashboard de vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo datos del dashboard de vehículos',
      error: error.message
    });
  }
};

// Obtener resumen consolidado para dashboard principal
const obtenerResumenDashboard = async (req, res) => {
  try {
    console.log('📊 Generando resumen consolidado del dashboard');
    
    // Obtener datos de ambas vistas
    const gastosQuery = `SELECT * FROM vista_gasto_vehiculo`;
    const vehiculosQuery = `SELECT * FROM vista_vehiculos_dashboard`;
    
    const [gastosResult, vehiculosResult] = await Promise.all([
      db.query(gastosQuery),
      db.query(vehiculosQuery)
    ]);
    
    // Procesar datos para resumen
    const gastosData = gastosResult.rows;
    const vehiculosData = vehiculosResult.rows;
    
    // Calcular totales
    const totalCombustibleMes = gastosData.reduce((sum, item) => 
      sum + parseFloat(item.combustible_mes_actual || 0), 0);
    
    const totalOtrosGastosMes = gastosData.reduce((sum, item) => 
      sum + parseFloat(item.otros_gastos_mes_actual || 0), 0);
    
    const totalCombustibleAnio = gastosData.reduce((sum, item) => 
      sum + parseFloat(item.combustible_anio_actual || 0), 0);
    
    const totalOtrosGastosAnio = gastosData.reduce((sum, item) => 
      sum + parseFloat(item.otros_gastos_anio_actual || 0), 0);
    
    // Contadores de vehículos por estado
    const vehiculosPorEstado = {};
    vehiculosData.forEach(vehiculo => {
      const estado = vehiculo.estado_vehiculo;
      vehiculosPorEstado[estado] = (vehiculosPorEstado[estado] || 0) + 1;
    });
    
    const resumen = {
      totales: {
        vehiculos: vehiculosData.length,
        combustibleMesActual: totalCombustibleMes,
        otrosGastosMesActual: totalOtrosGastosMes,
        gastoTotalMesActual: totalCombustibleMes + totalOtrosGastosMes,
        combustibleAnioActual: totalCombustibleAnio,
        otrosGastosAnioActual: totalOtrosGastosAnio,
        gastoTotalAnioActual: totalCombustibleAnio + totalOtrosGastosAnio
      },
      vehiculosPorEstado,
      gastosDetalle: gastosData,
      vehiculosDetalle: vehiculosData
    };
    
    console.log('✅ Resumen del dashboard generado:', {
      totalVehiculos: resumen.totales.vehiculos,
      gastoMesActual: resumen.totales.gastoTotalMesActual,
      gastoAnioActual: resumen.totales.gastoTotalAnioActual,
      estadosVehiculos: Object.keys(vehiculosPorEstado).length
    });
    
    res.json({
      success: true,
      data: resumen
    });
  } catch (error) {
    console.error('❌ Error generando resumen del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error generando resumen del dashboard',
      error: error.message
    });
  }
};

// Obtener gastos mensuales por vehículo
const obtenerGastosMensuales = async (req, res) => {
  try {
    console.log('📊 Obteniendo gastos mensuales por vehículo');
    
    const query = `
      WITH gastos_mensuales AS (
          SELECT
              v.id AS vehiculo_id,
              v.placa,
              v.marca,
              v.modelo,
              TO_CHAR(c.fecha_carga, 'YYYY-MM') AS mes,
              SUM(c.total_pagado) AS total_combustible,
              0 AS total_otros_gastos
          FROM vehiculo v
          LEFT JOIN carga_combustible c ON v.id = c.id_vehiculo
          GROUP BY v.id, v.placa, v.marca, v.modelo, TO_CHAR(c.fecha_carga, 'YYYY-MM')

          UNION ALL

          SELECT
              v.id AS vehiculo_id,
              v.placa,
              v.marca,
              v.modelo,
              TO_CHAR(og.fecha_gasto, 'YYYY-MM') AS mes,
              0 AS total_combustible,
              SUM(og.monto) AS total_otros_gastos
          FROM vehiculo v
          LEFT JOIN gastos_adicional og ON v.id = og.id_vehiculo
          GROUP BY v.id, v.placa, v.marca, v.modelo, TO_CHAR(og.fecha_gasto, 'YYYY-MM')
      )
      SELECT
          vehiculo_id,
          placa,
          marca,
          modelo,
          mes,
          SUM(total_combustible) AS total_combustible,
          SUM(total_otros_gastos) AS total_otros_gastos
      FROM gastos_mensuales
      WHERE mes IS NOT NULL
      GROUP BY vehiculo_id, placa, marca, modelo, mes
      ORDER BY vehiculo_id, mes;
    `;
    
    const result = await db.query(query);
    
    console.log(`✅ ${result.rows.length} registros de gastos mensuales encontrados`);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo gastos mensuales:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo datos de gastos mensuales',
      error: error.message
    });
  }
};

module.exports = {
  obtenerGastosVehiculos,
  obtenerDashboardVehiculos,
  obtenerResumenDashboard,
  obtenerGastosMensuales
};
