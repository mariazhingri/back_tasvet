const db = require("../config/conexion");

const Veterinario = {};
// Función para obtener las mascotas agendadas por el veterinario
// esta funcion saca el where con id_usuario que trae el token
Veterinario.MascotasAgendadas = async (id_usuario) => {
  try {
    const sql = `SELECT 
          -- Datos de Mascota
          m.id_mascota AS idMascota,
          m.fecha_nacimiento AS fechaNacimiento,
          m.nombre_mascota AS nombre,
          m.especie,
          r.nombre_raza AS raza,
          -- Datos de cliente
          cl.id_cliente AS cliente_id,
          pc.nombre AS cliente_nombre,
          pc.apellido AS cliente_apellido,
          pc.telefono_1 AS cliente_telefono,
          cl.direccion AS direccionCliente,
          -- servicios
          s.id_servicio AS idServicio,
          s.descripcion AS nombreServicio,
          s.descripcion AS descripcionServicio,
          ds.fecha_hora_inicio AS fechaHoraInicio,
          ds.fecha_hora_fin AS fechaHoraFin
          
        FROM usuarios u
        JOIN personas p ON u.persona_id = p.id_persona
        JOIN empleados e ON e.persona_id = p.id_persona
        JOIN detalle_servicios ds ON ds.empleado_id = e.id_empleado
        join servicios s on ds.servicio_id = s.id_servicio
        JOIN citas c ON ds.cita_id = c.id_cita
        JOIN clientes cl ON c.cliente_id = cl.id_cliente
        JOIN personas pc ON cl.persona_id = pc.id_persona
        JOIN mascotas m ON c.mascota_id = m.id_mascota
        JOIN razas r ON m.raza_id = r.id_raza
        WHERE u.id_usuario = ?
          AND c.estado_cita = 'Pendiente'
          AND m.estado = 'A'
          AND r.estado = 'A'
        group by c.id_cita
        ORDER BY c.id_cita;
    `;
    const [rows] = await db.query(sql, [id_usuario]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Funcion para en base al id_mascota obtener los datos de la cita agendada
// con sus servicios
Veterinario.atencionVeterinaria = async (id_mascota) => {
  try {
    const sql = `SELECT 
              c.id_cita,
              c.estado_cita,
              m.id_mascota,
              m.nombre_mascota,
              m.especie,
              m.fecha_nacimiento,
              r.nombre_raza,
              p.nombre,
              p.apellido,
              p.telefono_1  AS telefono,
              cl.direccion,
              GROUP_CONCAT(
                CONCAT(
                  '{',
                    '"id_servicio":', si.id_servicio, ',',
                    '"descripcion":"', si.descripcion, '",',
                    '"formulario":"', si.formulario, '",',
                    '"fecha_hora_inicio":"', si.fecha_hora_inicio, '",',
                    '"empleados":[', si.empleados_json, ']',
                  '}'
                )
                ORDER BY si.fecha_hora_inicio
                SEPARATOR ','
              ) AS servicios
            FROM citas c
            INNER JOIN clientes cl 
              ON c.cliente_id = cl.id_cliente
            INNER JOIN personas p 
              ON cl.persona_id = p.id_persona
            INNER JOIN mascotas m 
              ON c.mascota_id = m.id_mascota
            INNER JOIN razas r 
              ON m.raza_id = r.id_raza

            INNER JOIN (
              SELECT 
                ds.cita_id,
                s.id_servicio,
                s.descripcion,
                s.formulario,
                ds.fecha_hora_inicio,
                GROUP_CONCAT(
                  CONCAT(
                    '{',
                      '"id_empleado":', ds.empleado_id, ',',
                      '"id_detalle_servicio":', ds.id_detalle_servicio, ',',
                      '"nombre_empleado":"', pe.nombre, ' ', pe.apellido, '",',
                      '"telefono_empleado":"', pe.telefono_1, '",',
                      '"cargo":"', e.cargo, '"',
                    '}'
                  )
                  ORDER BY ds.fecha_hora_inicio
                  SEPARATOR ','
                ) AS empleados_json
              FROM detalle_servicios ds
              INNER JOIN servicios s 
                ON ds.servicio_id = s.id_servicio
              INNER JOIN empleados e 
                ON ds.empleado_id = e.id_empleado
              INNER JOIN personas pe 
                ON e.persona_id = pe.id_persona
              WHERE 
                ds.estado    = 'A'
                AND s.estado  = 'A'
                AND e.estado  = 'A'
                AND pe.estado = 'A'
              GROUP BY 
                ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
            ) AS si 
              ON c.id_cita = si.cita_id

            WHERE 
              m.id_mascota   = ?
              AND c.estado_cita = 'Pendiente'
              AND cl.estado     = 'A'
              AND p.estado      = 'A'
              AND m.estado      = 'A'
              AND r.estado      = 'A'

            GROUP BY 
              c.id_cita,
              m.id_mascota,
              m.nombre_mascota,
              m.especie,
              m.fecha_nacimiento,
              r.nombre_raza,
              p.nombre,
              p.apellido,
              p.telefono_1,
              cl.direccion;`;
    const [result] = await db.query(sql, [id_mascota]);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = Veterinario;
