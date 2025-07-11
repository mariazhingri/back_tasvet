const db = require("../config/conexion");
const cron = require("node-cron");

const empleados = {};
/*NO OLVIDAR: organizar esta funcion - deberia cambiarla aqui*/
empleados.obtenerEmpleados = async () => {
  try {
    const sql = `
            select e.id_empleado, p.id_persona, u.id_usuario ,p.nombre,p.apellido,p.cedula,p.telefono_1,e.cargo, e.descripcion
            from empleados e
            INNER JOIN personas p on e.persona_id = p.id_persona
            inner join usuarios u on p.id_persona = u.persona_id
            where e.estado = 'A'
            AND p.estado = 'A'
            `;
    const [rows] = await db.query(sql);
    console.log("Lista Empleados: ", rows)
    return rows;
  } catch (error) {
    throw error;
  }
};

empleados.obtenerCitasPorEmpleados = async (params) => {
  try {
    const sql = `select id_detalle_servicio, c.id_cita, ds.empleado_id , ds.servicio_id, s.descripcion  ,ds.fecha_hora_inicio, ds.fecha_hora_fin
            from detalle_servicios ds
            inner join citas c on ds.cita_id = c.id_cita
            inner join servicios s on ds.servicio_id = s.id_servicio
            where ds.empleado_id  = ?
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
/*Esta funcion es para que se muestre las citas de un empleado(veterianrio)
logeado - extrae el id_usuario del token*/
empleados.obtenerCitasPorUsuarioId = async (id_usuario) => {
  try {
    const sql = `select c.id_cita, e.id_empleado  , ds.servicio_id  ,ds.fecha_hora_inicio, ds.fecha_hora_fin
              from usuarios u 
              inner join personas p on u.persona_id = p.id_persona
              inner join empleados e on p.id_persona  = e.persona_id
              inner join detalle_servicios ds on e.id_empleado = ds.empleado_id
              inner join citas c on ds.cita_id = c.id_cita
              where u.id_usuario = ?
              AND ds.estado = 'A'
              AND c.estado_cita = 'Pendiente'
              AND e.estado = 'A';
            `;
    const [rows] = await db.query(sql, [id_usuario]);
    return rows;
  } catch (error) {
    throw error;
  }
};


empleados.obtenerCitasPorUsuarioIdV2 = async (id_usuario) => {
  try {
    const sql = `
      SELECT 
        c.id_cita,
        c.estado_cita,
        m.nombre_mascota,
        m.especie,
        r.nombre_raza,
        c.fecha_hora_inicio,
        cli_persona.nombre,
        cli_persona.apellido,
        cli_persona.telefono_1,
        cli.direccion
      FROM empleados e
      INNER JOIN usuarios u ON u.persona_id = e.persona_id
      INNER JOIN detalle_servicios ds ON ds.empleado_id = e.id_empleado
      INNER JOIN citas c ON c.id_cita = ds.cita_id
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      INNER JOIN clientes cli ON m.cliente_id = cli.id_cliente
      INNER JOIN personas cli_persona ON cli.persona_id = cli_persona.id_persona
      WHERE u.id_usuario = ?
        AND ds.estado = 'A'
        AND c.estado_cita = 'Pendiente'
        AND e.estado = 'A';
            `;
    const [rows] = await db.query(sql, [id_usuario]);
    return rows;
  } catch (error) {
    throw error;
  }
};


empleados.obtenerCitasPorRangoFecha = async (id_usuario, fechaInicio, fechaFin) => {
  try {
    const sql = `
      SELECT 
        c.id_cita AS idCita,
        c.estado_cita AS estadoCita,
        m.nombre_mascota AS mascotaNombre,
        m.especie AS mascotaEspecie,
        r.nombre_raza AS mascotaRaza,
        CONCAT(cli_persona.nombre, ' ', cli_persona.apellido) AS clienteNombre,
        cli_persona.telefono_1 AS clienteContacto,
        NULL AS clienteDireccion, -- no existe campo direccion en personas
        e.id_empleado AS idEmpleado,
        CONCAT(emp_persona.nombre, ' ', emp_persona.apellido) AS empleadoNombre,
        ds.fecha_hora_inicio AS fechaHoraCita,
        ds.fecha_hora_fin AS fechaHoraFin
      FROM usuarios u
      INNER JOIN personas emp_persona ON u.persona_id = emp_persona.id_persona
      INNER JOIN empleados e ON emp_persona.id_persona = e.persona_id
      INNER JOIN detalle_servicios ds ON e.id_empleado = ds.empleado_id
      INNER JOIN citas c ON ds.cita_id = c.id_cita
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      INNER JOIN clientes cli ON m.cliente_id = cli.id_cliente
      INNER JOIN personas cli_persona ON cli.persona_id = cli_persona.id_persona
      WHERE u.id_usuario = ?
        AND ds.estado = 'A'
        AND c.estado_cita = 'Pendiente'
        AND e.estado = 'A'
        AND ds.fecha_hora_inicio BETWEEN ? AND ?;
    `;

    const [rows] = await db.query(sql, [id_usuario, fechaInicio, fechaFin]);
    return rows;
  } catch (error) {
    throw error;
  }
};
// Obtener empleado por id_usuario
// Esta funcion es para que se muestre el empleado logeado - extrae el id_usuario del token
empleados.obtenerempleadoPorUsuario = async (id_usuario) => {
  console.log("ID de usuario recibido:", id_usuario);
  try {
    const sql = `
       select e.id_empleado
        from usuarios u
        inner join personas p on u.persona_id = p.id_persona
        inner join empleados e on p.id_persona = e.persona_id
        where u.id_usuario = ?
    `;
    const [rows] = await db.query(sql, [id_usuario]);
    console.log("Empleado encontrado:", rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

// -----GRAFICAS -----
// Obtener total de citas atendidas por mes en un año específico
empleados.obtenerTotalCitasAtendidasPorMes = async (anio) => {
  try {
    const sql = `
      SELECT 
        CONCAT(p.nombre, ' ', p.apellido) AS empleado,
        m.id_mes AS mes,
        m.descripcion AS mes_nombre,
        COUNT(ds.cita_id) AS total_citas
      FROM empleados e
      INNER JOIN personas p ON e.persona_id = p.id_persona
      CROSS JOIN meses m
      LEFT JOIN detalle_servicios ds 
        ON ds.empleado_id = e.id_empleado 
        AND MONTH(ds.fecha_hora_inicio) = m.id_mes 
        AND YEAR(ds.fecha_hora_inicio) = ?
      LEFT JOIN citas c 
        ON c.id_cita = ds.cita_id 
        AND c.estado_cita = 'Atendida'
      WHERE ds.estado = 'A' OR ds.estado IS NULL
      GROUP BY e.id_empleado, m.id_mes
      ORDER BY e.id_empleado, m.id_mes;
    `;

    const [rows] = await db.query(sql, [anio]);
    console.log("Total de citas atendidas por mes:", rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

// empleados.obtenerCitasPorIdUsuario = async (params) => {
//   try {
//     const sql = `
//       SELECT 
//         c.id_cita,
//         c.fecha_hora_cita,
//         c.estado_cita,
//         c.mascota_id,
//         c.cliente_id,
//         ds.id_detalle_servicio,
//         ds.servicio_id,
//         ds.fecha_hora_inicio,
//         ds.fecha_hora_fin
//       FROM usuarios u
//       JOIN personas p ON u.persona_id = p.id_persona
//       JOIN empleados e ON e.persona_id = p.id_persona
//       JOIN detalle_servicios ds ON ds.empleado_id = e.id_empleado
//       JOIN citas c ON c.id_cita = ds.cita_id
//       WHERE u.id_usuario = ?
//         AND ds.estado = 'A'
//         AND c.estado_cita IS NOT NULL;
//                   `;
//     const [rows] = await db.query(sql, [params.id_usuario]);
//     return rows;
//   } catch (error) {
//     throw error;
//   }
// };

//-----------CONSULTAS CITAS DEL VETERINARIO----------------
empleados.obtenerCitas = async (id_usuario) => {
  try {
    const sql = `
      SELECT 
        c.id_cita, 
        c.estado_cita,
        m.id_mascota,
        m.nombre_mascota,
        m.especie,
        m.fecha_nacimiento,
        r.nombre_raza,
        p.nombre,
        p.apellido,
        p.telefono_1,
        cl.direccion,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            '{',
            '"id_servicio":', servicio_info.id_servicio, ',',
            '"descripcion":"', servicio_info.descripcion, '",',
            '"formulario":"', servicio_info.formulario, '",',
            '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
            '"empleados":[', servicio_info.empleados_json, ']',
            '}'
          ) SEPARATOR ','
        ) AS servicios
      
      FROM usuarios u
      JOIN personas pers ON u.persona_id = pers.id_persona
      JOIN empleados emp ON emp.persona_id = pers.id_persona
      JOIN detalle_servicios ds ON ds.empleado_id = emp.id_empleado
      JOIN citas c ON ds.cita_id = c.id_cita
      JOIN clientes cl ON c.cliente_id = cl.id_cliente
      JOIN personas p ON cl.persona_id = p.id_persona
      JOIN mascotas m ON c.mascota_id = m.id_mascota
      JOIN razas r ON m.raza_id = r.id_raza
      
      -- Subconsulta para agrupar empleados por servicio y cita
      INNER JOIN (
        SELECT 
          ds.cita_id,
          s.id_servicio,
          s.descripcion,
          s.formulario,
          ds.fecha_hora_inicio,
          GROUP_CONCAT(
            DISTINCT CONCAT(
              '{',
              '"id_empleado":', ds.empleado_id, ',',
              '"id_detalle_servicio":', ds.id_detalle_servicio, ',',
              '"nombre_empleado":"', pe.nombre, ' ', pe.apellido, '",',
              '"telefono_empleado":"', pe.telefono_1, '",',
              '"cargo":"', e.cargo, '"',
              '}'
            ) SEPARATOR ','
          ) AS empleados_json
        FROM detalle_servicios ds
        JOIN servicios s ON ds.servicio_id = s.id_servicio
        JOIN empleados e ON ds.empleado_id = e.id_empleado
        JOIN personas pe ON e.persona_id = pe.id_persona
        WHERE 
          e.estado = 'A' AND
          pe.estado = 'A' AND
          ds.estado = 'A'
        GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
      ) AS servicio_info ON c.id_cita = servicio_info.cita_id
      
      WHERE 
        u.id_usuario = ? AND
        c.estado_cita = 'Pendiente' AND
        cl.estado = 'A' AND
        p.estado = 'A' AND
        m.estado = 'A' AND
        r.estado = 'A'
      
      GROUP BY c.id_cita;
    `;

    const [rows] = await db.query(sql, [id_usuario]);
    console.log('Citas obtenidas pendientes:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};


empleados.obtenerCitasRetrasadas = async (id_usuario) => {
  try {
    const sql = `
      SELECT 
        c.id_cita, 
        c.estado_cita,
        m.id_mascota,
        m.nombre_mascota,
        m.especie,
        m.fecha_nacimiento,
        r.nombre_raza,
        p.nombre,
        p.apellido,
        p.telefono_1,
        cl.direccion,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            '{',
            '"id_servicio":', servicio_info.id_servicio, ',',
            '"descripcion":"', servicio_info.descripcion, '",',
            '"formulario":"', servicio_info.formulario, '",',
            '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
            '"empleados":[', servicio_info.empleados_json, ']',
            '}'
          ) SEPARATOR ','
        ) AS servicios
      
      FROM usuarios u
      JOIN personas pers ON u.persona_id = pers.id_persona
      JOIN empleados emp ON emp.persona_id = pers.id_persona
      JOIN detalle_servicios ds ON ds.empleado_id = emp.id_empleado
      JOIN citas c ON ds.cita_id = c.id_cita
      JOIN clientes cl ON c.cliente_id = cl.id_cliente
      JOIN personas p ON cl.persona_id = p.id_persona
      JOIN mascotas m ON c.mascota_id = m.id_mascota
      JOIN razas r ON m.raza_id = r.id_raza
      
      -- Subconsulta para agrupar empleados por servicio y cita
      INNER JOIN (
        SELECT 
          ds.cita_id,
          s.id_servicio,
          s.descripcion,
          s.formulario,
          ds.fecha_hora_inicio,
          GROUP_CONCAT(
            DISTINCT CONCAT(
              '{',
              '"id_empleado":', ds.empleado_id, ',',
              '"id_detalle_servicio":', ds.id_detalle_servicio, ',',
              '"nombre_empleado":"', pe.nombre, ' ', pe.apellido, '",',
              '"telefono_empleado":"', pe.telefono_1, '",',
              '"cargo":"', e.cargo, '"',
              '}'
            ) SEPARATOR ','
          ) AS empleados_json
        FROM detalle_servicios ds
        JOIN servicios s ON ds.servicio_id = s.id_servicio
        JOIN empleados e ON ds.empleado_id = e.id_empleado
        JOIN personas pe ON e.persona_id = pe.id_persona
        WHERE 
          e.estado = 'A' AND
          pe.estado = 'A' AND
          ds.estado = 'A'
        GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
      ) AS servicio_info ON c.id_cita = servicio_info.cita_id
      
      WHERE 
        u.id_usuario = ? AND
        c.estado_cita = 'Retrasada' AND
        cl.estado = 'A' AND
        p.estado = 'A' AND
        m.estado = 'A' AND
        r.estado = 'A'
      
      GROUP BY c.id_cita;
    `;

    const [rows] = await db.query(sql, [id_usuario]);
    console.log('Citas obtenidas retrasada:', rows);
    return rows;
  } catch (error) {
    throw error;
  }

};


empleados.obtenerCitasCanceladas = async (id_usuario) => {
  try {
    const sql = `
      SELECT 
        c.id_cita, 
        c.estado_cita,
        m.id_mascota,
        m.nombre_mascota,
        m.especie,
        m.fecha_nacimiento,
        r.nombre_raza,
        p.nombre,
        p.apellido,
        p.telefono_1,
        cl.direccion,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            '{',
            '"id_servicio":', servicio_info.id_servicio, ',',
            '"descripcion":"', servicio_info.descripcion, '",',
            '"formulario":"', servicio_info.formulario, '",',
            '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
            '"empleados":[', servicio_info.empleados_json, ']',
            '}'
          ) SEPARATOR ','
        ) AS servicios
      
      FROM usuarios u
      JOIN personas pers ON u.persona_id = pers.id_persona
      JOIN empleados emp ON emp.persona_id = pers.id_persona
      JOIN detalle_servicios ds ON ds.empleado_id = emp.id_empleado
      JOIN citas c ON ds.cita_id = c.id_cita
      JOIN clientes cl ON c.cliente_id = cl.id_cliente
      JOIN personas p ON cl.persona_id = p.id_persona
      JOIN mascotas m ON c.mascota_id = m.id_mascota
      JOIN razas r ON m.raza_id = r.id_raza
      
      -- Subconsulta para agrupar empleados por servicio y cita
      INNER JOIN (
        SELECT 
          ds.cita_id,
          s.id_servicio,
          s.descripcion,
          s.formulario,
          ds.fecha_hora_inicio,
          GROUP_CONCAT(
            DISTINCT CONCAT(
              '{',
              '"id_empleado":', ds.empleado_id, ',',
              '"id_detalle_servicio":', ds.id_detalle_servicio, ',',
              '"nombre_empleado":"', pe.nombre, ' ', pe.apellido, '",',
              '"telefono_empleado":"', pe.telefono_1, '",',
              '"cargo":"', e.cargo, '"',
              '}'
            ) SEPARATOR ','
          ) AS empleados_json
        FROM detalle_servicios ds
        JOIN servicios s ON ds.servicio_id = s.id_servicio
        JOIN empleados e ON ds.empleado_id = e.id_empleado
        JOIN personas pe ON e.persona_id = pe.id_persona
        WHERE 
          e.estado = 'A' AND
          pe.estado = 'A' AND
          ds.estado = 'A'
        GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
      ) AS servicio_info ON c.id_cita = servicio_info.cita_id
      
      WHERE 
        u.id_usuario = ? AND
        c.estado_cita = 'Cancelada' AND
        cl.estado = 'A' AND
        p.estado = 'A' AND
        m.estado = 'A' AND
        r.estado = 'A'
      
      GROUP BY c.id_cita;
    `;

    const [rows] = await db.query(sql, [id_usuario]);
    console.log('Citas obtenidas retrasada:', rows);
    return rows;
  } catch (error) {
    throw error;
  }

};


empleados.obtenerCitasAtendidas = async (id_usuario) => {
  try {
    const sql = `
      SELECT 
        c.id_cita, 
        c.estado_cita,
        m.id_mascota,
        m.nombre_mascota,
        m.especie,
        m.fecha_nacimiento,
        r.nombre_raza,
        p.nombre,
        p.apellido,
        p.telefono_1,
        cl.direccion,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            '{',
            '"id_servicio":', servicio_info.id_servicio, ',',
            '"descripcion":"', servicio_info.descripcion, '",',
            '"formulario":"', servicio_info.formulario, '",',
            '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
            '"empleados":[', servicio_info.empleados_json, ']',
            '}'
          ) SEPARATOR ','
        ) AS servicios
      
      FROM usuarios u
      JOIN personas pers ON u.persona_id = pers.id_persona
      JOIN empleados emp ON emp.persona_id = pers.id_persona
      JOIN detalle_servicios ds ON ds.empleado_id = emp.id_empleado
      JOIN citas c ON ds.cita_id = c.id_cita
      JOIN clientes cl ON c.cliente_id = cl.id_cliente
      JOIN personas p ON cl.persona_id = p.id_persona
      JOIN mascotas m ON c.mascota_id = m.id_mascota
      JOIN razas r ON m.raza_id = r.id_raza
      
      -- Subconsulta para agrupar empleados por servicio y cita
      INNER JOIN (
        SELECT 
          ds.cita_id,
          s.id_servicio,
          s.descripcion,
          s.formulario,
          ds.fecha_hora_inicio,
          GROUP_CONCAT(
            DISTINCT CONCAT(
              '{',
              '"id_empleado":', ds.empleado_id, ',',
              '"id_detalle_servicio":', ds.id_detalle_servicio, ',',
              '"nombre_empleado":"', pe.nombre, ' ', pe.apellido, '",',
              '"telefono_empleado":"', pe.telefono_1, '",',
              '"cargo":"', e.cargo, '"',
              '}'
            ) SEPARATOR ','
          ) AS empleados_json
        FROM detalle_servicios ds
        JOIN servicios s ON ds.servicio_id = s.id_servicio
        JOIN empleados e ON ds.empleado_id = e.id_empleado
        JOIN personas pe ON e.persona_id = pe.id_persona
        WHERE 
          e.estado = 'A' AND
          pe.estado = 'A' AND
          ds.estado = 'A'
        GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
      ) AS servicio_info ON c.id_cita = servicio_info.cita_id
      
      WHERE 
        u.id_usuario = ? AND
        c.estado_cita = 'Atendida' AND
        cl.estado = 'A' AND
        p.estado = 'A' AND
        m.estado = 'A' AND
        r.estado = 'A'
      
      GROUP BY c.id_cita;
    `;

    const [rows] = await db.query(sql, [id_usuario]);
    console.log('Citas obtenidas retrasada:', rows);
    return rows;
  } catch (error) {
    throw error;
  }

};
empleados.obtenerCargoDeEmpleados = async () => {
  try{
    const sql = `select  id_rol, descripcion 
        from roles r`
    const [rows] = await db.query(sql);
    console.log('Roles obtenidos:', rows);
    return rows
  }catch (error) {
    throw error;
  }
}

/*---------funcion para crear un empleado-------- */
empleados.CrearEmpleado = async (params) => {
  console.log("data empleado: ", params)
  try{
    const currentDate = new Date();
    const sql = `INSERT INTO empleados (
                  persona_id,
                  cargo,
                  descripcion,
                  estado,
                  reg_fecha,
                  reg_usuario
                ) VALUES (?,?,?,?,?,?)`
    const [rows] = await db.query(sql,[
      params.persona_id,
      params.cargo,
      params.descripcion,
      'A',
      currentDate,
      params.reg_usuario
    ]);
    return rows
  }catch (error) {
    throw error;
  }
}

empleados.darDeBajaEmpleado = async (params) => {
  console.log("data eliminar empleado: ", params)
  try{
    const currentDate = new Date();
    const sql = `UPDATE empleados 
                  SET estado = ?, 
                      eli_fecha = ?, 
                      eli_usuario = ?
                  WHERE id_empleado = ?`
    const [rows] = await db.query(sql,[
      'I',
      currentDate,
      params.eli_usuario,
      params.id_empleado
    ]);
    return rows
  }catch (error) {
    throw error;
  }
}

module.exports = empleados;
