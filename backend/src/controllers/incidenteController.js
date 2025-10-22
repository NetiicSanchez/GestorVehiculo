const pool = require('../config/database');
const { sendIncidentNotification } = require('../utils/telegramNotifier');

function sanitizeOptional(value) {
  // ...existing code...
  return errors;
}

exports.registrarIncidente = async (req, res) => {
  // ...existing code...
    const result = await pool.query(query, values);
    const incidenteCreado = result.rows[0];

    // --- Notificación por Telegram ---
    try {
      const vehiculoQuery = 'SELECT marca, modelo, placa FROM vehiculo WHERE id = $1';
      const vehiculoResult = await pool.query(vehiculoQuery, [incidenteCreado.id_vehiculo]);
      
      if (vehiculoResult.rows.length > 0) {
        const vehiculo = vehiculoResult.rows[0];
        // No usamos await para no bloquear la respuesta al cliente
        sendIncidentNotification(incidenteCreado, vehiculo);
      } else {
        console.warn(`Vehículo con ID ${incidenteCreado.id_vehiculo} no encontrado. No se enviará notificación.`);
      }
    } catch (notificationError) {
      console.error('Error en el bloque de notificación:', notificationError);
    }
    // --- Fin Notificación ---

    // AHORA LA RESPUESTA ES MÁS SIMPLE
    return res.status(201).json({
      success: true,
      data: incidenteCreado,
    });
  } catch (error) {
    console.error('Error al registrar incidente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};