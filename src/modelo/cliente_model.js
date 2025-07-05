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

Clientes.obtenerCitasCliente = async (id_usuario) => {
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
        
        FROM usuarios u
        JOIN personas p ON u.persona_id = p.id_persona
        JOIN clientes cl ON cl.persona_id = p.id_persona
        JOIN citas c ON c.cliente_id = cl.id_cliente
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
    console.log('Citas obtenidas para el cliente:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

Clientes.obtenerCitasClienteRetradas = async (id_usuario) => {
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
        
        FROM usuarios u
        JOIN personas p ON u.persona_id = p.id_persona
        JOIN clientes cl ON cl.persona_id = p.id_persona
        JOIN citas c ON c.cliente_id = cl.id_cliente
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
    console.log('Citas obtenidas para el cliente:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};

Clientes.obtenerCitasClienteCancelada = async (id_usuario) => {
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
        
        FROM usuarios u
        JOIN personas p ON u.persona_id = p.id_persona
        JOIN clientes cl ON cl.persona_id = p.id_persona
        JOIN citas c ON c.cliente_id = cl.id_cliente
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
            pe.estado = 'A' AND
            ds.estado = 'A'
          GROUP BY ds.cita_id, s.id_servicio, s.descripcion, s.formulario, ds.fecha_hora_inicio
        ) AS servicio_info ON c.id_cita = servicio_info.cita_id
        
        WHERE 
          u.id_usuario = ? AND
          c.estado_cita = 'Cancelad' AND
          cl.estado = 'A' AND
          p.estado = 'A' AND
          m.estado = 'A' AND
          r.estado = 'A'
        
        GROUP BY c.id_cita;
    `;
    const [rows] = await db.query(sql, [id_usuario]);
    console.log('Citas obtenidas para el cliente:', rows);
    return rows;
  } catch (error) {
    throw error;
  }
};




module.exports = Clientes;
