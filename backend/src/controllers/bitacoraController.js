const db = require('../config/database');

// Crear bitácora (placeholder)
exports.crearBitacora = async (req, res) => {
  try {
    // Extrae los datos del body
    const data = req.body;
    // Normaliza combustible
    let combustible = Number(data.combustible);
    if (!Number.isFinite(combustible) || combustible < 0 || combustible > 3) combustible = 0;

    // Inserta en la tabla bitacora_mantenimiento (ajusta los campos según tu esquema real)
    const sql = `INSERT INTO bitacora_mantenimiento (
      id_vehiculo, id_piloto, id_copiloto, fecha, hora, placa, kilometraje, proximo_servicio, ren_por_galon, observacion,
      vencimiento_licencia, tricket, llanta_repuesto, llave_cruz, combustible, limpieza, nivel_aceite, agua, liquido_freno,
      etiqueta_m, lubricante_cadena, luces_intermitentes, luz_stop, faros, tiempo_casco, traje_imp
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      $11,$12,$13,$14,$15,$16,$17,$18,$19,
      $20,$21,$22,$23,$24,$25,$26
    ) RETURNING id`;
    const params = [
      data.id_vehiculo, data.id_piloto, data.id_copiloto, data.fecha, data.hora, data.placa, data.kilometraje, data.proximo_servicio, data.ren_por_galon, data.observacion,
      Number(data.vencimiento_licencia), Number(data.tricket), Number(data.llanta_repuesto), Number(data.llave_cruz), combustible, Number(data.limpieza), Number(data.nivel_aceite), Number(data.agua), Number(data.liquido_freno),
      Number(data.etiqueta_m), Number(data.lubricante_cadena), Number(data.luces_intermitentes), Number(data.luz_stop), Number(data.faros), Number(data.tiempo_casco), Number(data.traje_imp)
    ];
    const result = await db.query(sql, params);
    res.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('crearBitacora error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener bitácoras (placeholder)
exports.obtenerBitacoras = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        TO_CHAR(b.fecha, 'YYYY-MM-DD') AS fecha,
        b.hora,
        v.placa,
        v.marca,
        v.modelo,
        CONCAT(v.marca, ' ', v.modelo, ' (', v.placa, ')') AS vehiculo,
        p.nombre AS piloto,
        p.apellido AS piloto_apellido,
        c.nombre AS copiloto,
        c.apellido AS copiloto_apellido,
        b.kilometraje,
        b.llanta_repuesto, b.llave_cruz, b.tricket, b.combustible, b.limpieza, b.proximo_servicio,
        b.etiqueta_m, b.lubricante_cadena, b.nivel_aceite, b.agua, b.vencimiento_licencia,
        b.luces_intermitentes, b.luz_stop, b.faros, b.liquido_freno, b.tiempo_casco,
        b.traje_imp, b.ren_por_galon, b.observacion
      FROM bitacora_mantenimiento b
      LEFT JOIN vehiculo v ON b.id_vehiculo = v.id
      LEFT JOIN usuario p ON b.id_piloto = p.id
      LEFT JOIN usuario c ON b.id_copiloto = c.id
      ORDER BY b.fecha DESC, b.hora DESC
    `;
    const result = await db.query(query);
    // Formatea los nombres completos
    const data = result.rows.map(row => ({
      fecha: row.fecha,
      hora: row.hora,
      vehiculo: row.vehiculo,
      piloto: row.piloto ? `${row.piloto} ${row.piloto_apellido}` : '',
      copiloto: row.copiloto ? `${row.copiloto} ${row.copiloto_apellido}` : '',
      kilometraje: row.kilometraje,
      llanta_repuesto: row.llanta_repuesto,
      llave_cruz: row.llave_cruz,
      tricket: row.tricket,
      combustible: row.combustible,
      limpieza: row.limpieza,
      proximo_servicio: row.proximo_servicio,
      etiqueta_m: row.etiqueta_m,
      lubricante_cadena: row.lubricante_cadena,
      nivel_aceite: row.nivel_aceite,
      agua: row.agua,
      vencimiento_licencia: row.vencimiento_licencia,
      luces_intermitentes: row.luces_intermitentes,
      luz_stop: row.luz_stop,
      faros: row.faros,
      liquido_freno: row.liquido_freno,
      tiempo_casco: row.tiempo_casco,
      traje_imp: row.traje_imp,
      ren_por_galon: row.ren_por_galon,
      observacion: row.observacion
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error('obtenerBitacoras error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Cumplimiento por vehículo y mes
exports.obtenerCumplimiento = async (req, res) => {
  try {
    const { anio, mes, id_vehiculo } = req.query;

    // Ajusta nombres de tablas/columnas reales
    const params = [];
    const where = [];
    if (anio) { params.push(anio); where.push(`EXTRACT(YEAR FROM fecha) = $${params.length}`); }
    if (mes) { params.push(mes); where.push(`EXTRACT(MONTH FROM fecha) = $${params.length}`); }
    if (id_vehiculo) { params.push(id_vehiculo); where.push(`id_vehiculo = $${params.length}`); }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT 
        id_vehiculo,
        DATE_TRUNC('month', fecha) AS periodo,
        SUM(COALESCE(CASE WHEN tricket = 1 THEN 1 ELSE 0 END, 0) +
            COALESCE(CASE WHEN llanta_repuesto = 1 THEN 1 ELSE 0 END, 0) +
            COALESCE(CASE WHEN llave_cruz = 1 THEN 1 ELSE 0 END, 0) +
            COALESCE(CASE WHEN nivel_aceite = 1 THEN 1 ELSE 0 END, 0) +
            COALESCE(CASE WHEN agua = 1 THEN 1 ELSE 0 END, 0) +
            COALESCE(CASE WHEN liquido_freno = 1 THEN 1 ELSE 0 END, 0)) AS puntos_cumplidos,
        COUNT(*) * 6 AS puntos_totales
      FROM bitacora_mantenimiento
      ${whereSql}
      GROUP BY id_vehiculo, DATE_TRUNC('month', fecha)
      ORDER BY periodo DESC, id_vehiculo
    `;

    const result = await db.query(sql, params);

    // Transformar a formato de serie por vehículo para chart
    const porVehiculo = {};
    for (const row of result.rows) {
      const veh = row.id_vehiculo;
      const porcentaje = row.puntos_totales > 0 ? Math.round((row.puntos_cumplidos / row.puntos_totales) * 100) : 0;
      if (!porVehiculo[veh]) porVehiculo[veh] = [];
      porVehiculo[veh].push({
        name: new Date(row.periodo).toISOString().slice(0, 7), // YYYY-MM
        value: porcentaje
      });
    }

    const data = Object.entries(porVehiculo).map(([veh, series]) => ({ name: `Vehículo ${veh}`, series }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('obtenerCumplimiento error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
