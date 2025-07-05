const db = require("../config/conexion");
const cron = require("node-cron");

const Auxiliar = {};

Auxiliar.obtenerCitaAuxiliar = async () => {
  try {
    const sql = `
      SELECT 
        c.id_cita AS idCita,
        c.estado_cita AS estadoCita,
        m.id_mascota as idMascota,
        m.nombre_mascota AS nombreMascota,
        m.especie,
        r.nombre_raza AS raza,
        ds.fecha_hora_inicio AS fechaHoraInicio,
        ds.fecha_hora_fin AS fechaHoraFin,
        CONCAT(p.nombre, ' ', p.apellido) AS nombreCliente,
        p.telefono_1 AS contactoCliente,
        cl.direccion AS direccionCliente,
      
        s.id_servicio AS idServicio,
        s.descripcion AS nombreServicio,
        s.descripcion AS descripcionServicio,
      
        e.id_empleado AS idEmpleado,
        CONCAT(pe.nombre, ' ', pe.apellido) AS nombreEmpleado,
        e.cargo,
        pe.telefono_1 AS telefono,
        pe.correo AS correoElectronico
      
      FROM citas c
      JOIN clientes cl ON c.cliente_id = cl.id_cliente
      JOIN personas p ON cl.persona_id = p.id_persona
      JOIN mascotas m ON c.mascota_id = m.id_mascota
      JOIN razas r ON m.raza_id = r.id_raza
      JOIN detalle_servicios ds ON c.id_cita = ds.cita_id
      JOIN servicios s ON ds.servicio_id = s.id_servicio
      LEFT JOIN empleados e ON ds.empleado_id = e.id_empleado
      LEFT JOIN personas pe ON e.persona_id = pe.id_persona
      
      WHERE c.estado_cita = 'Pendiente'
        AND cl.estado = 'A'
        AND p.estado = 'A'
        AND m.estado = 'A'
        AND r.estado = 'A'
        AND s.eliminado = 0
      ORDER BY c.id_cita;

    `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }

}


module.exports = Auxiliar;
