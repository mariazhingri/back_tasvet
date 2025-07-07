const nodemailer = require("nodemailer");
const CitaModel = require("../modelo/cita_model");
const ClienteModel = require("../modelo/cliente_model");
const PersonaModel = require("../modelo/persona_model");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mzhingri372@gmail.com",
    pass: "idhp gcvo hiue sxis",
  },
});

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function enviarCodigoVerificacion(correo) {
  console.log("correo al que se le va a generar codigo: ", correo)
  const codigo = generarCodigo();

  const mailOptions = {
    from: '"Maria Zhingri" <mzhingri372@gmail.com>',
    to: correo,
    subject: "Código de Verificación",
    text: `Tu código de verificación es: ${codigo}`,
    html: `<p>Tu código de verificación es: <strong>${codigo}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
  return codigo;
}

/**
 * Envía un correo electrónico de recordatorio o notificación
 * @param {string} destinatario - Email del destinatario
 * @param {string} asunto - Asunto del correo
 * @param {string} mensaje - Cuerpo del mensaje (puede ser HTML)
 */
async function enviarCorreoCitaAgendada (destinatario, asunto, mensaje) {
  const opcionesCorreo = {
    from: `"Sistema de Citas" <${process.env.CORREO_REMITENTE}>`,
    to: destinatario,
    subject: asunto,
    html: mensaje,
  };

  try {
    await transporter.sendMail(opcionesCorreo);
    console.log(`Correo enviado a: ${destinatario}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

async function enviarRecordatoriosCitas() {
  const ahora = new Date();

  const fechaMin24h = new Date(ahora.getTime() + 23.5 * 60 * 60 * 1000);
  const fechaMax24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

  const fechaMin2h = new Date(ahora.getTime() + 1.5 * 60 * 60 * 1000);
  const fechaMax2h = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);

  const citas24h = await CitaModel.buscarCitasEntre(fechaMin24h, fechaMax24h);
  const citas2h = await CitaModel.buscarCitasEntre(fechaMin2h, fechaMax2h);
  console.log('🔍 Buscando citas entre:', fechaMin24h, 'y', fechaMax24h);
  console.log('🔍 Citas encontradas 24h:', citas24h.length);
  console.log('🔍 Citas encontradas 2h:', citas2h.length);



  const todasLasCitas = [
    ...citas24h.map(c => ({ ...c, tipo: "24h" })),
    ...citas2h.map(c => ({ ...c, tipo: "2h" })),
  ];

  for (let cita of todasLasCitas) {
    try {
      const cliente = await ClienteModel.obtenerClientePorId(cita.cliente_id);

      const fechaCita = new Date(cita.fecha_hora_inicio).toLocaleString();
      const asunto =
        cita.tipo === "24h"
          ? "📅 Recordatorio: Tu cita es mañana"
          : "⏰ Recordatorio: Tu cita es en breve";

      const mensaje = `
        <div style="font-family: Arial; text-align: center;">
          <img src="https://via.placeholder.com/150x60.png?text=Logo+Empresa" alt="Logo Empresa" style="margin-bottom: 20px;">
          <h2 style="margin-bottom: 10px;">Hola ${cliente.nombre} ${cliente.apellido},</h2>
          <p style="font-size: 18px; margin-bottom: 20px;">
            Este es un recordatorio de tu cita.
          </p>
          <p style="font-size: 22px; font-style: italic; font-weight: bold; color: #2a7ae2;">
            🕒 ${fechaCita}
          </p>
          <p>¡Te esperamos! 🐾</p>
        </div>
      `;

      await enviarCorreoCitaAgendada(cliente.correo, asunto, mensaje);
      console.log(`✅ Recordatorio ${cita.tipo} enviado a ${cliente.correo}`);
    } catch (err) {
      console.error("❌ Error al procesar recordatorio:", err);
    }
  }
}



module.exports = { 
  enviarCodigoVerificacion,
  enviarCorreoCitaAgendada,
  enviarRecordatoriosCitas 
};
