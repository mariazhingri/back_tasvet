const db = require('../config/conexion');
const moment = require('moment-timezone');

const Citas = {};

Citas.obtenerCitas = async () => {
  try {
    sql = ` select c.id_cita, c.estado_cita,m.id_mascota,m.nombre_mascota, m.especie, m.fecha_nacimiento,r.nombre_raza, p.nombre, p.apellido, p.telefono_1 ,cl.direccion, c.fecha_hora_cita,
            s.id_servicio, ds.id_detalle_servicio, s.formulario, s.descripcion
            from citas c
            inner join clientes cl on c.cliente_id = cl.id_cliente
            inner join personas p on cl.persona_id = p.id_persona
            inner join mascotas m on c.mascota_id  = m.id_mascota
            inner join razas r on m.raza_id = r.id_raza
            inner join detalle_servicios ds on c.id_cita = ds.cita_id
            inner join servicios s on ds.servicio_id = s.id_servicio
            where c.estado_cita = 'Pendiente'
            and cl.estado = 'A'
            and p.estado = 'A'
            and m.estado  = 'A'
            and r.estado = 'A'
            ORDER BY c.id_cita
            `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

Citas.getCitasRetrasadas = async () => {
  try {
    sql = ` select c.id_cita, c.estado_cita,m.id_mascota,m.nombre_mascota, m.especie, m.fecha_nacimiento,r.nombre_raza, p.nombre, p.apellido, p.telefono_1 ,cl.direccion, c.fecha_hora_cita,
            s.id_servicio, ds.id_detalle_servicio, s.formulario, s.descripcion
            from citas c
            inner join clientes cl on c.cliente_id = cl.id_cliente
            inner join personas p on cl.persona_id = p.id_persona
            inner join mascotas m on c.mascota_id  = m.id_mascota
            inner join razas r on m.raza_id = r.id_raza
            inner join detalle_servicios ds on c.id_cita = ds.cita_id
            inner join servicios s on ds.servicio_id = s.id_servicio
            where c.estado_cita = 'Retrasada'
            and cl.estado = 'A'
            and p.estado = 'A'
            and m.estado  = 'A'
            and r.estado = 'A'
            ORDER BY c.id_cita
            `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

Citas.getCitasCanceladas = async () => {
  try {
    sql = ` select c.id_cita, c.estado_cita,m.id_mascota,m.nombre_mascota, m.especie, m.fecha_nacimiento,r.nombre_raza, p.nombre, p.apellido, p.telefono_1 ,cl.direccion, c.fecha_hora_cita,
            s.id_servicio, ds.id_detalle_servicio, s.formulario, s.descripcion
            from citas c
            inner join clientes cl on c.cliente_id = cl.id_cliente
            inner join personas p on cl.persona_id = p.id_persona
            inner join mascotas m on c.mascota_id  = m.id_mascota
            inner join razas r on m.raza_id = r.id_raza
            inner join detalle_servicios ds on c.id_cita = ds.cita_id
            inner join servicios s on ds.servicio_id = s.id_servicio
            where c.estado_cita = 'Cancelada'
            and cl.estado = 'A'
            and p.estado = 'A'
            and m.estado  = 'A'
            and r.estado = 'A'
            ORDER BY c.id_cita
            `;
    const [rows] = await db.query(sql);
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
             c.fecha_hora_cita
      FROM citas c
      INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
      INNER JOIN personas p ON cl.persona_id = p.id_persona
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      WHERE c.estado_cita = 'Pendiente'
        AND cl.estado = 'A'
        AND p.estado = 'A'
        AND m.estado = 'A'
        AND r.estado = 'A'
        AND DATE(c.fecha_hora_cita) = ?
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
      SELECT c.id_cita, c.estado_cita,
             m.nombre_mascota, m.especie,
             r.nombre_raza,
             p.nombre, p.apellido, p.telefono_1,
             cl.direccion,
             c.fecha_hora_cita
      FROM citas c
      INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
      INNER JOIN personas p ON cl.persona_id = p.id_persona
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      WHERE c.estado_cita = 'Pendiente'
        AND cl.estado = 'A'
        AND p.estado = 'A'
        AND m.estado = 'A'
        AND r.estado = 'A'
        AND c.id_cita = ?
    `;

    const [rows] = await db.query(sql, [id_cita]);

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
             c.fecha_hora_cita
      FROM citas c
      INNER JOIN clientes cl ON c.cliente_id = cl.id_cliente
      INNER JOIN personas p ON cl.persona_id = p.id_persona
      INNER JOIN mascotas m ON c.mascota_id = m.id_mascota
      INNER JOIN razas r ON m.raza_id = r.id_raza
      WHERE c.estado_cita = 'Pendiente'
        AND cl.estado = 'A'
        AND p.estado = 'A'
        AND m.estado = 'A'
        AND r.estado = 'A'
        AND c.fecha_hora_cita BETWEEN ? AND ?
      ORDER BY c.fecha_hora_cita ASC
    `;

    const [rows] = await db.query(sql, [inicioMes, finMes]);

    console.log(`✅ ${rows.length} citas encontradas en el rango`);
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
                fecha_hora_cita,
                estado_cita,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?, ?,'Pendiente', ?, ?)
        `;
    const [result] = await db.query(sql, [
      params.cliente_id,
      params.mascota_id,

      params.fecha_hora_cita,
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (err) {
    throw err;
  }
};

Citas.marcarCitasRestrasadas = async () => {
  const sql = `
      UPDATE citas
      SET estado_cita = 'Retrasada'
      WHERE 
        DATE_ADD(fecha_hora_cita, INTERVAL 60 MINUTE) < NOW()
        AND estado_cita = 'Pendiente';
    `;
  await db.query(sql);
};
Citas.actualizarCita = async () => {};

Citas.cambiarEstadoCita = async () => {};

Citas.eliminarCita = async () => {};

Citas.buscarCitaPorFechaHoraEmpleado = async (fecha_hora_cita) => {
  // Convertimos la fecha a la zona horaria de Ecuador
  const inicio = moment(fecha_hora_cita).tz('America/Guayaquil');
  const fin = inicio.clone().add(29, 'minutes');

  // Formateamos para MySQL (formato 'YYYY-MM-DD HH:mm:ss')
  const inicioSQL = inicio.format('YYYY-MM-DD HH:mm:ss');
  const finSQL = fin.format('YYYY-MM-DD HH:mm:ss');

  console.log('Rango búsqueda inicio:', inicioSQL);
  console.log('Rango búsqueda fin:', finSQL);

  const result = await db.query(
    `
        SELECT * FROM citas 
        WHERE fecha_hora_cita BETWEEN ? AND ?
    `,
    [inicioSQL, finSQL],
  );

  return result && result.length > 0 ? result[0] : null;
};

module.exports = Citas;
