const db = require("../config/conexion");
const Persona = {};

Persona.crearPersona = async (params) => {
  console.log("data persona: ", params)
  const currentDate = new Date();
  const sql = `
    INSERT INTO personas (
      cedula, 
      correo,
      nombre, 
      apellido, 
      telefono_1,
      telefono_2, 
      estado, 
      reg_fecha, 
      reg_usuario)
    VALUES (?, ?, ?, ?,?,?, 'A', ?, ?)`;
  const [result] = await db.query(sql, [
    params.cedula,
    params.correo,
    params.nombre,
    params.apellido,
    params.telefono_1,
    params.telefono_2,
    currentDate,
    params.reg_usuario,
  ]);
  return result.insertId;
};

Persona.actualizarPersona = async (params) => {
  try {
    console.log("👉 Recibido en actualizarPersona:", params);
    const currentDate = new Date();
    const sql = `
      UPDATE personas SET
        correo = ?,
        apellido = ?,
        nombre = ?,
        telefono_1 = ?,
        telefono_2 = ?,
        act_fecha = ?,
        act_usuario = ?
      WHERE id_persona = ?
    `;

    const [result] = await db.query(sql, [
      params.correo,
      params.apellido,
      params.nombre,
      params.telefono_1,
      params.telefono_2,
      currentDate,
      params.act_usuario,
      params.id_persona,
    ]);

    // Devuelve true si se actualizó al menos una fila
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error en Persona.updatePersona:", error);
    throw error;
  }
};

module.exports = Persona;
