const db = require('../config/conexion');
const moment = require('moment-timezone');

const Citas = {};
/* Obtener citas en estado pendiente [porque se esta usando order by y no group by?]*/
Citas.obtenerCitas = async () => {
  try {
    sql = `

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
            CONCAT(
              '{',
              '"id_servicio":', servicio_info.id_servicio, ',',
              '"descripcion":"', servicio_info.descripcion, '",',
              '"formulario":"', servicio_info.formulario, '",',
              '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
              '"empleados":[', servicio_info.empleados_json, ']',
              '}'
            )
            SEPARATOR ','
          ) AS servicios
        FROM citas c
        INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
        INNER JOIN personas p ON cl.persona_id = p.id_persona
        INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
        INNER JOIN razas r ON m.raza_id = r.id_raza
        INNER JOIN (
          -- Subconsulta para agrupar empleados por servicio y cita
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
              SEPARATOR ','
            ) AS empleados_json
          FROM detalle_servicios ds
          INNER JOIN servicios s ON ds.servicio_id = s.id_servicio
          INNER JOIN empleados e ON ds.empleado_id = e.id_empleado
          INNER JOIN personas pe ON e.persona_id = pe.id_persona
          WHERE 
            e.estado = 'A' AND
            pe.estado = 'A'
          GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
        ) AS servicio_info ON c.id_cita = servicio_info.cita_id
        WHERE 
          c.estado_cita = 'Pendiente' AND
          cl.estado = 'A' AND
          p.estado = 'A' AND
          m.estado = 'A' AND
          r.estado = 'A'
        GROUP BY c.id_cita

            `;
    //ORDER BY c.id_cita
    const [rows] = await db.query(sql);
    console.log('Citas obtenidas pendites:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

Citas.getCitasRetrasadas = async () => {
  try {
    sql = `
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
            CONCAT(
              '{',
              '"id_servicio":', servicio_info.id_servicio, ',',
              '"descripcion":"', servicio_info.descripcion, '",',
              '"formulario":"', servicio_info.formulario, '",',
              '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
              '"empleados":[', servicio_info.empleados_json, ']',
              '}'
            )
            SEPARATOR ','
          ) AS servicios
        FROM citas c
        INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
        INNER JOIN personas p ON cl.persona_id = p.id_persona
        INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
        INNER JOIN razas r ON m.raza_id = r.id_raza
        INNER JOIN (
          -- Subconsulta para agrupar empleados por servicio y cita
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
              SEPARATOR ','
            ) AS empleados_json
          FROM detalle_servicios ds
          INNER JOIN servicios s ON ds.servicio_id = s.id_servicio
          INNER JOIN empleados e ON ds.empleado_id = e.id_empleado
          INNER JOIN personas pe ON e.persona_id = pe.id_persona
          WHERE 
            e.estado = 'A' AND
            pe.estado = 'A'
          GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
        ) AS servicio_info ON c.id_cita = servicio_info.cita_id
        WHERE 
          c.estado_cita = 'Retrasada' AND
          cl.estado = 'A' AND
          p.estado = 'A' AND
          m.estado = 'A' AND
          r.estado = 'A'
        GROUP BY c.id_cita


        
            `;
    const [rows] = await db.query(sql);
    console.log('Citas retrasadas obtenidas:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

Citas.getCitasCanceladas = async () => {
  try {
    sql = `

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
            CONCAT(
              '{',
              '"id_servicio":', servicio_info.id_servicio, ',',
              '"descripcion":"', servicio_info.descripcion, '",',
              '"formulario":"', servicio_info.formulario, '",',
              '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
              '"empleados":[', servicio_info.empleados_json, ']',
              '}'
            )
            SEPARATOR ','
          ) AS servicios
        FROM citas c
        INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
        INNER JOIN personas p ON cl.persona_id = p.id_persona
        INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
        INNER JOIN razas r ON m.raza_id = r.id_raza
        INNER JOIN (
          -- Subconsulta para agrupar empleados por servicio y cita
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
              SEPARATOR ','
            ) AS empleados_json
          FROM detalle_servicios ds
          INNER JOIN servicios s ON ds.servicio_id = s.id_servicio
          INNER JOIN empleados e ON ds.empleado_id = e.id_empleado
          INNER JOIN personas pe ON e.persona_id = pe.id_persona
          WHERE 
            e.estado = 'A' AND
            pe.estado = 'A'
          GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
        ) AS servicio_info ON c.id_cita = servicio_info.cita_id
        WHERE 
          c.estado_cita = 'Cancelada' AND
          cl.estado = 'A' AND
          p.estado = 'A' AND
          m.estado = 'A' AND
          r.estado = 'A'
        GROUP BY c.id_cita
            `;
    const [rows] = await db.query(sql);
    console.log('Citas canceladas obtenidas:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

Citas.getCitasByDate = async (fecha) => {
  console.log('Fecha recibida back:', fecha);
  try {
    const sql = `
      SELECT c.id_cita, c.estado_cita,
             m.nombre_mascota, m.especie,
             r.nombre_raza,
             p.nombre, p.apellido, p.telefono_1,
             cl.direccion,
             ds.fecha_hora_inicio
      FROM citas c
      inner join detalle_servicios ds on c.id_cita = ds.cita_id
      INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
      INNER JOIN personas p ON cl.persona_id = p.id_persona
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      WHERE c.estado_cita = 'Pendiente'
        AND cl.estado = 'A'
        AND p.estado = 'A'
        AND m.estado = 'A'
        AND r.estado = 'A'
        AND DATE(ds.fecha_hora_inicio) = ?
      GROUP BY c.id_cita
    `;

    const [rows] = await db.query(sql, [fecha]);
    console.log('Rows obtenidos:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

Citas.getCitasByIdCita = async (id_cita) => {
  console.log('📥 Id de cita recibida en getCitasByIdCita:', id_cita);

  if (!id_cita || isNaN(Number(id_cita))) {
    throw new Error('ID de cita inválido');
  }

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
            CONCAT(
              '{',
              '"id_servicio":', servicio_info.id_servicio, ',',
              '"descripcion":"', servicio_info.descripcion, '",',
              '"formulario":"', servicio_info.formulario, '",',
              '"fecha_hora_inicio":"', servicio_info.fecha_hora_inicio, '",',
              '"empleados":[', servicio_info.empleados_json, ']',
              '}'
            )
            SEPARATOR ','
          ) AS servicios
        FROM citas c
        INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
        INNER JOIN personas p ON cl.persona_id = p.id_persona
        INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
        INNER JOIN razas r ON m.raza_id = r.id_raza
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
              SEPARATOR ','
            ) AS empleados_json
          FROM detalle_servicios ds
          INNER JOIN servicios s ON ds.servicio_id = s.id_servicio
          INNER JOIN empleados e ON ds.empleado_id = e.id_empleado
          INNER JOIN personas pe ON e.persona_id = pe.id_persona
          WHERE 
            e.estado = 'A' AND
            pe.estado = 'A'
          GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
        ) AS servicio_info ON c.id_cita = servicio_info.cita_id
        WHERE 
          c.id_cita = ? AND
          cl.estado = 'A' AND
          p.estado = 'A' AND
          m.estado = 'A' AND
          r.estado = 'A'
        GROUP BY c.id_cita;
        
    `;


    const [rows] = await db.query(sql, [id_cita]);
    console.log('Rows obtenidos:', rows);

    if (rows.length === 0) {
      console.warn(`⚠️ No se encontró cita con ID ${id_cita}`);
      return null;
    }

    console.log('✅ Cita obtenida:', rows[0]);
    return rows[0]; // Devuelve solo el objeto
  } catch (error) {
    console.error('❌ Error en getCitasByIdCita:', error.message);
    throw new Error('Error al obtener la cita por ID');
  }
};

Citas.getCitasByRangoMes = async (inicioMes, finMes) => {
  console.log('📥 Rango de citas recibido:', inicioMes, finMes);

  if (!inicioMes || !finMes) {
    throw new Error('Fechas de inicio y fin requeridas');
  }

  try {
    const sql = `
      SELECT c.id_cita, c.estado_cita,
             m.nombre_mascota, m.especie,
             r.nombre_raza,
             p.nombre, p.apellido, p.telefono_1,
             cl.direccion,
             ds.fecha_hora_inicio
      FROM citas c
      inner join detalle_servicios ds on c.id_cita = ds.cita_id
      INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
      INNER JOIN personas p ON cl.persona_id = p.id_persona
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      WHERE c.estado_cita = 'Pendiente'
        AND cl.estado = 'A'
        AND p.estado = 'A'
        AND m.estado = 'A'
        AND r.estado = 'A'
        AND ds.fecha_hora_inicio BETWEEN ? AND ?
      ORDER BY ds.fecha_hora_inicio ASC
    `;

    const [rows] = await db.query(sql, [inicioMes, finMes]);

    console.log(`✅ ${rows.length} citas encontradas en el rango`);
    console.log('Citas obtenidas segun rango de fechas:', rows);
    return rows;
  } catch (error) {
    console.error('❌ Error al obtener citas por rango:', error.message);
    throw new Error('Error al consultar citas por rango de fechas');
  }
};

Citas.getCitasByRangoIdEmpleado = async (fechaInicio, fechaFin, idEmpleado) => {
  console.log('📥 Rango de citas recibido:', fechaInicio, fechaFin, idEmpleado);

  if (!fechaInicio || !fechaFin || !idEmpleado) {
    throw new Error('Fechas de inicio y fin requeridas y tambien idempledo mi bro');
  }

  try {
    const sql = `
      SELECT c.id_cita, c.estado_cita,
             m.nombre_mascota, m.especie,
             r.nombre_raza,
             p.nombre, p.apellido, p.telefono_1,
             cl.direccion,
             ds.fecha_hora_inicio
      FROM citas c
      inner join detalle_servicios ds on c.id_cita = ds.cita_id
      INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
      INNER JOIN personas p ON cl.persona_id = p.id_persona
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      WHERE c.estado_cita = 'Pendiente'
        AND cl.estado = 'A'
        AND p.estado = 'A'
        AND m.estado = 'A'
        AND r.estado = 'A'
        AND ds.empleado_id = ?
        AND ds.fecha_hora_inicio BETWEEN ? AND ?
      ORDER BY ds.fecha_hora_inicio ASC
    `;

    const [rows] = await db.query(sql, [idEmpleado, fechaInicio, fechaFin]);

    console.log(`✅ ${rows.length} citas encontradas en el rango`);
    console.log('Citas obtenidas segun rango de fechas:', rows);
    return rows;
  } catch (error) {
    console.error('❌ Error al obtener citas por rango:', error.message);
    throw new Error('Error al consultar citas por rango de fechas');
  }
};



Citas.crearCita = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            INSERT INTO citas (
                cliente_id, 
                mascota_id,
                estado_cita,  
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?, ?, ?,?)
        `;
    const [result] = await db.query(sql, [
      params.cliente_id,
      params.mascota_id,
      'Pendiente',
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (err) {
    throw err;
  }
};
/* esta funcion de marcar citas retrasadas se ejecuta cada 5 minutos
y actualiza el estado de las citas que ya han pasado su hora de finalización */
Citas.marcarCitasRestrasadas = async () => {
  const sql = `
      UPDATE citas c
      JOIN detalle_servicios ds ON c.id_cita = ds.cita_id
      SET estado_cita = 'Retrasada'
      WHERE 
        ds.fecha_hora_fin < NOW()
        AND c.estado_cita = 'Pendiente';
    `;
  await db.query(sql);
};


Citas.cancelarCita = async (id_cita, motivo) => {
  try {
    const currentDate = new Date();
    const sql = `
      UPDATE citas
      SET 
        estado_cita = 'Cancelada',
        motivo_cancelacion = ?,
        fecha_cancelacion = ?
      WHERE id_cita = ?
    `;

    const [result] = await db.query(sql, [
      motivo,
      currentDate,
      id_cita
    ]);

    return result;
  } catch (err) {
    throw err;
  }
};


Citas.actualizarCita = async () => { };

Citas.cambiarEstadoCita = async () => { };

Citas.eliminarCita = async () => { };


Citas.buscarCitaPorFechaHoraEmpleado = async (fecha_hora_inicio, empleado_id) => {
  // Convertimos la fecha a la zona horaria de Ecuador
  const inicio = moment(fecha_hora_inicio).tz('America/Guayaquil');
  const fin = inicio.clone().add(29, 'minutes');

  // Formateamos para MySQL (formato 'YYYY-MM-DD HH:mm:ss')
  const inicioSQL = inicio.format('YYYY-MM-DD HH:mm:ss');
  const finSQL = fin.format('YYYY-MM-DD HH:mm:ss');

  console.log('Rango búsqueda inicio:', inicioSQL);
  console.log('Rango búsqueda fin:', finSQL);

  const sql = `
  SELECT c.*, ds.*
  FROM citas c
  INNER JOIN detalle_servicios ds ON c.id_cita = ds.cita_id
  WHERE ds.empleado_id = ?
    AND (
      (ds.fecha_hora_inicio BETWEEN ? AND ?)
      OR (ds.fecha_hora_fin BETWEEN ? AND ?)
      OR (? BETWEEN ds.fecha_hora_inicio AND ds.fecha_hora_fin)
    )
`;

  const [result] = await db.query(sql, [
    empleado_id,
    inicioSQL, finSQL,
    inicioSQL, finSQL,
    inicioSQL
  ]);
  return result && result.length > 0 ? result : [];
};

Citas.buscarCitasEntre = async (desde, hasta) => {
  try {
    const sql = `
      SELECT c.*, ds.*
      FROM citas c
      INNER JOIN detalle_servicios ds ON c.id_cita = ds.cita_id
      WHERE ds.fecha_hora_inicio BETWEEN ? AND ?
    `;
    const [rows] = await db.query(sql, [desde, hasta]);
    return rows;
  } catch (error) {
    console.error("❌ Error en buscarCitasEntre:", error);
    throw error;
  }
};

Citas.buscarCitaPendientePorMascota = async (params) => {
  try {
    sql = `SELECT * 
            FROM citas 
            WHERE mascota_id = ? 
            AND estado_cita = 'pendiente';
          `
    const [result] = await db.query(sql, [params.mascota_id]);
    return result;
  } catch (err) {
    throw err
  }
}

module.exports = Citas;
