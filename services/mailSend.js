const nodemailer = require("nodemailer");

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

module.exports = { enviarCodigoVerificacion };
