const db = require("../config/conexion");
const cron = require("node-cron");

const CodigoVerificacion = {};

CodigoVerificacion.guardarCodigo = async (correo, codigo) => {
  const expiracion = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
  const sql = `
    INSERT INTO codigos_verificacion (correo, codigo, expiracion)
    VALUES (?, ?, ?)
  `;
  db.execute(sql, [correo, codigo, expiracion]);
};

// esta funcion verifica si el codigo ya expiro
//lo que hace es ver:
// Que el correo coincida,
// Que el código sea el correcto,
// Que aún esté dentro del tiempo de expiración, y
// Que no se haya usado antes.
CodigoVerificacion.verificarCodigoDB = async (correo, codigo) => {
  console.log("Verificando código para:", correo, "con código:", codigo);

  const sql = `
        SELECT * FROM codigos_verificacion
        WHERE correo = ? AND codigo = ? AND expiracion > NOW() AND usado = 0
        ORDER BY id DESC LIMIT 1
    `;
  const [result] = await db.execute(sql, [correo, codigo]);
  console.log("codigo validado: ", result)

  if (result.length > 0) {
    // Marcar el código como usado
    const updateSql = `
            UPDATE codigos_verificacion
            SET usado = 1
            WHERE id = ?
        `;
    await db.execute(updateSql, [result[0].id]);
    return true;
  }
  return false;
};

module.exports = CodigoVerificacion;
