const db = require("../config/conexion");
const cron = require("node-cron");

const empleados = {};
/*NO OLVIDAR: organizar esta funcion - deberia cambiarla aqui*/
empleados.obtenerEmpleados = async () => {
  try {
    const sql = `
            select id_empleado, p.nombre,p.apellido,e.cargo, e.descripcion
            from empleados e
            INNER JOIN personas p on e.persona_id = p.id_persona
            where e.estado = 'A'
            AND p.estado = 'A'
            `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

empleados.obtenerCitasPorEmpleados = async (params) => {
  try {
    const sql = `select c.id_cita, ds.empleado_id , ds.servicio_id, s.descripcion  ,ds.fecha_hora
            from detalle_servicios ds
            inner join citas c on ds.cita_id = c.id_cita
            inner join servicios s on ds.servicio_id = s.id_servicio
            where ds.empleado_id  = 1
            AND ds.estado = 'A'
            AND s.estado = 'A'
            AND c.estado_cita = 'Pendiente'
            `;
    const [rows] = await db.query(sql, [params.empleado_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};



empleados.obtenerCitasPorIdUsuario = async (params) => {
  try {
    const sql = `
      SELECT 
        c.id_cita,
        c.fecha_hora_cita,
        c.estado_cita,
        c.mascota_id,
        c.cliente_id,
        ds.id_detalle_servicio,
        ds.servicio_id,
        ds.fecha_hora_inicio,
        ds.fecha_hora_fin
      FROM usuarios u
      JOIN personas p ON u.persona_id = p.id_persona
      JOIN empleados e ON e.persona_id = p.id_persona
      JOIN detalle_servicios ds ON ds.empleado_id = e.id_empleado
      JOIN citas c ON c.id_cita = ds.cita_id
      WHERE u.id_usuario = ?
        AND ds.estado = 'A'
        AND c.estado_cita IS NOT NULL;
                  `;
    const [rows] = await db.query(sql, [params.id_usuario]);
    return rows;
  } catch (error) {
    throw error;
  }
};



module.exports = empleados;
