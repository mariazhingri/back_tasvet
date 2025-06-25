const db = require("../config/conexion");

const Clientes = {};

Clientes.obtenerDatosUsuario = async (params) => {
  try {
    sql = `select p.*, r.descripcion as rol
                from personas p
                inner join usuarios u on p.id_persona = u.persona_id
                inner join roles r on u.rol_id = r.id_rol
                where u.id_usuario = ?
                and u.estado = 'A'`;
    const [rows] = await db.query(sql, [params.id_usuario]);
    if (rows.length === 0) {
      return null; // No se encontró el cliente
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
};

Clientes.obtenerDatosCliente = async () => {
  try {
    sql = `select c.id_cliente, p.id_persona,p.nombre, p.apellido, p.cedula, p.telefono_1, p.telefono_2, p.correo, c.direccion
                from clientes c
                inner join personas p on c.persona_id = p.id_persona
                and c.estado = 'A'
                `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

Clientes.crearCliente = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            INSERT INTO clientes (
                persona_id, direccion,
                estado, reg_fecha,reg_usuario
            )
            VALUES ( ?, ?,'A', ?, ?)
        `;
    const [result] = await db.query(sql, [
      params.persona_id,
      params.direccion,
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (err) {
    throw err;
  }
};

Clientes.actualizarCliente = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            UPDATE clientes SET 
                direccion = ?, 
                act_fecha = ?, 
                act_usuario = ?
            WHERE id_cliente = ?
        `;

    const [result] = await db.query(sql, [
      params.direccion,
      currentDate,
      params.act_usuario,
      params.id_cliente,
    ]);

    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

Clientes.eliminarCliente = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            UPDATE clientes 
            SET estado = 'I', 
                eli_fecha = ?, 
                eli_usuario = ?
            WHERE id_cliente = ?
        `;

    const [result] = await db.query(sql, [
      currentDate,
      params.eli_usuario,
      params.id_cliente,
    ]);

    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};

Clientes.obtenerClientePorId = async (id_cliente) => {
  console.log('cliente desde model: ', id_cliente);
  try {
    const sql = `SELECT p.nombre, p.apellido, p.correo
                 FROM personas p
                 INNER JOIN clientes c ON p.id_persona = c.persona_id
                 WHERE id_cliente = ?`;
    
    const [result] = await db.query(sql, [id_cliente]);

    // Retorna la primera fila si existe
    return result.length > 0 ? result[0] : null;
  } catch (err) {
    throw err;
  }
};


module.exports = Clientes;
