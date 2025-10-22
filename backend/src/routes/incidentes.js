const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { sendIncidentNotification } = require('../utils/telegramNotifier');

// Crear incidente
router.post('/', async (req, res) => {
  try {
    console.log('📥 POST /api/incidentes body:', req.body);
    const {
      id_vehiculo,
      id_piloto,
      tipo_incidente,
      kilometraje,
      detalle,
      fotos,
      tipo_aceite,
      tipo_mantenimiento,
      tipo_accesorio,
      correo_incidente,
      urgencia
    } = req.body;

    // Validaciones básicas
    if (!id_vehiculo || !id_piloto || !tipo_incidente) {
      return res.status(400).json({
        success: false,
        message: 'Campos obligatorios faltantes',
        required: { id_vehiculo: !id_vehiculo, id_piloto: !id_piloto, tipo_incidente: !tipo_incidente }
      });
    }

    // Validar urgencia si viene
    let urgenciaValue = null;
    if (urgencia !== undefined && urgencia !== null && urgencia !== '') {
      const normalized = String(urgencia).toLowerCase();
      if (!['baja','media','alta'].includes(normalized)) {
        return res.status(400).json({ success: false, message: 'Valor de urgencia inválido', allowed: ['baja','media','alta'] });
      }
      urgenciaValue = normalized;
    }

    const query = `
      INSERT INTO incidente (
        id_vehiculo, id_piloto, tipo_incidente, kilometraje, detalle, fotos,
        tipo_aceite, tipo_mantenimiento, tipo_accesorio, correo_incidente, urgencia
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;
    const values = [
      id_vehiculo,
      id_piloto,
      tipo_incidente,
      kilometraje || null,
      detalle || null,
      fotos || null,
      tipo_aceite || null,
      tipo_mantenimiento || null,
      tipo_accesorio || null,
      correo_incidente || null,
      urgenciaValue
    ];
    const result = await pool.query(query, values);
    const creado = result.rows[0];

    // Notificación Telegram en background
    try {
      const vehiculoRes = await pool.query('SELECT marca, modelo, placa FROM vehiculo WHERE id = $1', [creado.id_vehiculo]);
      const vehiculo = vehiculoRes.rows[0] || null;
      sendIncidentNotification(creado, vehiculo);
    } catch (e) {
      console.error('No se pudo enviar notificación de Telegram:', e.message);
    }

    res.status(201).json({ success: true, data: creado });
  } catch (error) {
    console.error('❌ Error creando incidente:', error);
    res.status(500).json({ success: false, message: 'Error creando incidente', error: error.message });
  }
});

// Listar incidentes (básico)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT i.*, 
             (i.fecha_creacion AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota') as fecha_creacion_local,
             v.placa, v.marca, v.modelo,
             u.nombre as nombre_piloto, u.apellido as apellido_piloto
      FROM incidente i
      LEFT JOIN vehiculo v ON i.id_vehiculo = v.id
      LEFT JOIN usuario u ON i.id_piloto = u.id
      ORDER BY i.fecha_creacion DESC
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('❌ Error listando incidentes:', error);
    res.status(500).json({ success: false, message: 'Error listando incidentes', error: error.message });
  }
});

module.exports = router;
