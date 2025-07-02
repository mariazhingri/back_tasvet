const db = require('../config/conexion');

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
  console.log('Crear detalle_servicio con:', params);
  try {
    const currentDate = new Date();
    const sql = `
            INSERT INTO detalle_servicios (cita_id, servicio_id, empleado_id, fecha_hora_inicio, fecha_hora_fin, estado, reg_fecha, reg_usuario)
            VALUES (?,?,?,?,?,?,?,?)`;
    const [result] = await db.query(sql, [
      params.cita_id,
      params.servicio_id,
      params.empleado_id,
      params.fecha_hora_inicio,
      params.fecha_hora_fin,
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
        SELECT 
          id_servicio,
          descripcion,
          categoria,
          formulario,
          estado,
          reg_fecha,
          reg_usuario,
          act_fecha,
          act_usuario
        FROM servicios
        WHERE formulario IS NOT NULL
          AND eliminado = 0
          AND estado = 'A';
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

Servicios.eliminarServicioDeCita = async ({ cita_id, servicio_id }) => {
  console.log('Eliminar detalle_servicio con:', { cita_id, servicio_id });

  if (cita_id == null || servicio_id == null) {
    throw new Error('cita_id y servicio_id son obligatorios');
  }

  try {
    const sql = `
      DELETE FROM detalle_servicios
      WHERE cita_id = ? AND servicio_id = ?
    `;
    const [rows] = await db.query(sql, [cita_id, servicio_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

Servicios.agregarServicioaCita = async (params) => {
  console.log('agregar servicio:', params);
  try {
    const sql = `
      INSERT INTO detalle_servicios (
        cita_id,
        servicio_id,
        estado,
        reg_usuario
      ) VALUES (?, ?, ?, ?);
    `;
    const [rows] = await db.query(sql,
      [
        params.cita_id,
        params.servicio_id,
        'A',
        params.reg_usuario
      ]);
    return rows;
  } catch (error) {
    throw error;
  }
};

Servicios.obtenerServicioPorId = async (id_servicio) => {
  try {
    const sql = `
      SELECT id_servicio, descripcion, categoria, formulario, estado
      FROM servicios
      WHERE id_servicio = ? AND eliminado = 0;
    `;
    const [rows] = await db.query(sql, [id_servicio]);
    return rows[0]; // Retorna el primer servicio encontrado
  } catch (error) {
    throw error;
  }
};

/*-------- Graficas -------*/
// Obtener servicios mas solicitados
Servicios.obtenerServiciosMasSolicitados = async (anio) => {
  try {
    const sql = `SELECT s.descripcion, COUNT(ds.servicio_id) AS cantidad
      FROM detalle_servicios ds
      INNER JOIN servicios s ON ds.servicio_id = s.id_servicio
      inner join citas c on ds.cita_id  = c.id_cita
      WHERE YEAR(ds.fecha_hora_inicio) = ?
        AND c.estado_cita = 'Atendida'
      GROUP BY ds.servicio_id
      ORDER BY cantidad DESC
    `;
    const [rows] = await db.query(sql, [anio]);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = Servicios;
