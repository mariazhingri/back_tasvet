const db = require('../config/conexion');
const Usuarios = require('./user_model');

const Servicios = {};

Servicios.crearServicio = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO servicios (descripcion, categoria, formulario ,estado, reg_fecha,reg_usuario)
            VALUES (?, ?, ?, ?, ?,?)`;
    const [result] = await db.query(sql, [
      params.descripcion,
      params.categoria,
      params.formulario,
      'A',
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

Servicios.crearServicioV2 = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO servicios (descripcion, categoria, formulario, estado, reg_fecha,reg_usuario)
            VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      params.descripcion,
      params.categoria,
      params.formulario,
      'A',
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

Servicios.obtenerServicios = async () => {
  try {
    // Consulta para obtener los servicios (descripcion y categoria) que estan resgistrados en la base de datos
    const sql = `
      SELECT s.id_servicio, s.descripcion, s.categoria, s.formulario, s.estado
            FROM servicios s
            INNER JOIN usuarios u ON s.reg_usuario = u.id_usuario
            WHERE s.eliminado = 0
      `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

Servicios.actualizarServicio = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            UPDATE servicios
            SET descripcion = ?, categoria = ?, act_fecha = ?, act_usuario = ?
            WHERE id_servicio = ?`;
    const [result] = await db.query(sql, [
      params.descripcion,
      params.categoria,
      currentDate,
      params.act_usuario,
      params.id_servicio,
    ]);

    return result.affectedRows; // Devuelve el número de filas afectadas
  } catch (error) {
    throw error;
  }
};

Servicios.putEstadoNoDisponible = async (id_servicio, eli_usuario) => {
  try {
    const currentDate = new Date();
    const sql = `
            UPDATE servicios
            SET estado = 'I', eli_fecha = ?, eli_usuario = ?
            WHERE id_servicio = ?`;
    const [result] = await db.query(sql, [currentDate, eli_usuario, id_servicio]);

    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

Servicios.putEstadoDisponible = async (id_servicio, eli_usuario) => {
  try {
    const currentDate = new Date();
    const sql = `
            UPDATE servicios
            SET estado = 'A', eli_fecha = ?, eli_usuario = ?
            WHERE id_servicio = ?`;
    const [result] = await db.query(sql, [currentDate, eli_usuario, id_servicio]);

    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

Servicios.eliminarServicioV2 = async (id_servicio, eli_usuario) => {
  try {
    const currentDate = new Date();
    const sql = `
      UPDATE servicios
      SET eliminado = 1, eli_fecha = ?, eli_usuario = ?
      WHERE id_servicio = ?`;

    const [result] = await db.query(sql, [currentDate, eli_usuario, id_servicio]);
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

Servicios.crearDetalleServicio = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            INSERT INTO detalle_servicios (cita_id, servicio_id,estado, reg_fecha,reg_usuario)
            VALUES (?,?,?,?,?)`;
    const [result] = await db.query(sql, [
      params.cita_id,
      params.servicio_id,
      'A',
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

Servicios.obtenerFomularios = async () => {
  try {
    const sql = `
            select s.formulario, s.descripcion,s.categoria
            from servicios s
            where s.estado = 'A'
            `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

  Servicios.verificarFormularioLlegando = async (IdFormulario) => {
  try {
    // 1. Obtenemos los formularios habilitados en el sistema
    const formulariosHabilitados = await Servicios.obtenerFomularios();
    
    // 2. Mapeamos los formularios disponibles para facilitar la búsqueda
    const formulariosDisponibles = formulariosHabilitados.map(f => f.formulario);
    
    // 3. Verificamos si el IdFormulario está habilitado
    if (formulariosDisponibles.includes(IdFormulario)) {
      return true; // El formulario está habilitado
    } else {
      return false; // El formulario no está habilitado
    }
  } catch (error) {
    console.error("Error al verificar formulario:", error);
    throw error;
  }
};
module.exports = Servicios;
