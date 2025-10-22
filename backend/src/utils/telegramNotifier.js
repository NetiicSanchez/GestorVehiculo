const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Formatea una fecha a zona America/Guatemala y español de GT
function formatFechaGuatemala(fechaLike) {
  try {
    const d = new Date(fechaLike);
    if (isNaN(d.getTime())) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Guatemala'
    }).format(d);
  } catch (e) {
    return 'Sin fecha';
  }
}

function safeText(v, fallback = 'Sin detalle') {
  const t = (v ?? '').toString().trim();
  return t.length ? t : fallback;
}

/**
 * Envía una notificación de incidente a un chat de Telegram.
 * @param {object} incidente - El objeto del incidente.
 * @param {object} vehiculo - El objeto del vehículo relacionado.
 */
async function sendIncidentNotification(incidente, vehiculo) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Las variables de entorno de Telegram no están configuradas. No se enviará la notificación.');
    return;
  }

  // Fallbacks para campos que pueden variar en la BD
  const fechaSource = incidente.fecha_creacion || incidente.fecha_registro || incidente.fecha || Date.now();
  const fechaLocal = formatFechaGuatemala(fechaSource);
  const descripcion = safeText(incidente.detalle ?? incidente.descripcion);
  const reportadoPor = safeText(incidente.reportado_por, 'No especificado');
  const tipoIncidente = safeText(incidente.tipo_incidente, 'N/D');

  // Urgencia
  const urgRaw = (incidente.urgencia || 'media').toString().toLowerCase();
  const urgEmoji = urgRaw === 'alta' ? '🔴 Alta' : urgRaw === 'baja' ? '🟢 Baja' : '🟠 Media';

  const marca = safeText(vehiculo?.marca, '').replace(/^$/,'Desconocida');
  const modelo = safeText(vehiculo?.modelo, '').trim();
  const placa = safeText(vehiculo?.placa, 'N/D');

  const message = `
🚨 *¡Nueva Incidencia Registrada!* 🚨

*Vehículo:* ${marca}  ${modelo}
*Placa:* ${placa}
*Tipo:* ${tipoIncidente}
*Urgencia:* ${urgEmoji}
*Fecha:* ${fechaLocal}

*Descripción:*
${descripcion}

*Reportado por:*
${reportadoPor}
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('Notificación de Telegram enviada con éxito.');
  } catch (error) {
    console.error('Error al enviar la notificación de Telegram:', error.response ? error.response.data : error.message);
  }
}

module.exports = {
  sendIncidentNotification
};
