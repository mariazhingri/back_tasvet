const db = require("../config/conexion");
const Usuarios = require("../modelo/user_model");

const Mascota = {};

Mascota.obtenerMascota = async () => {
  try {
    const sql = `
            SELECT m.*,r.nombre_raza
            FROM mascotas m
            inner join razas r on m.raza_id = r.id_raza
            WHERE m.estado = 'A';`;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};
Mascota.obtenerMascotaPorId = async (idMascota) => {
  if (!idMascota || isNaN(Number(idMascota))) {
    throw new Error("ID de mascota inválido");
  }

  try {
    const sql = `
      SELECT 
        m.id_mascota AS idMascota,
        m.cliente_id AS idCliente,
        m.nombre_mascota AS nombre,
        m.especie,
        r.nombre_raza AS raza,
        m.fecha_nacimiento AS fechaNacimiento,
        m.sexo,
        m.peso_kg AS pesoKg,
        m.estado,
        p.cedula,
        p.correo,
        p.nombre AS nombre_persona,
        p.apellido,
        p.telefono_1 AS telefono,
        p.telefono_2 AS telefonoSecundario
      FROM mascotas m
      LEFT JOIN clientes cl ON m.cliente_id = cl.id_cliente
      LEFT JOIN personas p ON cl.persona_id = p.id_persona
      LEFT JOIN razas r ON m.raza_id = r.id_raza
      WHERE m.id_mascota = ?
    `;

    const [rows] = await db.query(sql, [idMascota]);

    if (rows.length === 0) {
      console.warn(`⚠️ No se encontró mascota con ID ${idMascota}`);
      return null;
    }

    console.log("✅ Mascota obtenida:", rows[0]);
    return rows[0];
  } catch (error) {
    console.error("❌ Error al obtener mascota:", error.message);
    throw new Error("Error al obtener la mascota por ID");
  }
};


Mascota.obtenerMascotaPorIdUsuario = async (id_usuario) => {
  if (!id_usuario || isNaN(Number(id_usuario))) {
    throw new Error("ID de usuario inválido");
  }

  try {
    const sql = `
        SELECT 
          m.id_mascota,
          m.nombre_mascota,
          m.especie,
          m.fecha_nacimiento,
          r.nombre_raza,
          cl.direccion,
          p.nombre,
          p.apellido,
          p.telefono_1
        FROM usuarios u
        JOIN personas p ON u.persona_id = p.id_persona
        JOIN clientes cl ON cl.persona_id = p.id_persona
        JOIN mascotas m ON m.cliente_id = cl.id_cliente
        JOIN razas r ON m.raza_id = r.id_raza
        WHERE 
          u.id_usuario = ? AND
          p.estado = 'A' AND
          cl.estado = 'A' AND
          m.estado = 'A' AND
          r.estado = 'A';
            `;

    const [rows] = await db.query(sql, [id_usuario]);

    if (rows.length === 0) {
      console.warn(`⚠️ No se encontró mascota con ID usuario ${id_usuario}`);
      return null;
    }

    console.log("✅ Mascota obtenida:", rows[0]);
    return rows[0];
  } catch (error) {
    console.error("❌ Error al obtener mascota:", error.message);
    throw new Error("Error al obtener la mascota por ID");
  }
};


Mascota.obtenerRazas = async () => {
  try {
    const sql = `
            SELECT id_raza, nombre_raza
            FROM razas r 
            WHERE estado = 'A';`;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

Mascota.crearMascota = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            INSERT INTO mascotas (
                cliente_id, nombre_mascota, especie, raza_id, 
                fecha_nacimiento, sexo, peso_kg, 
                estado, reg_fecha,reg_usuario
            )
            VALUES (?, ?, ?, ?, ?, ?, ?,'A', ?,?)
        `;
    const [mascotaResult] = await db.query(sql, [
      params.cliente_id,
      params.nombre_mascota,
      params.especie,
      params.raza_id,
      params.fecha_nacimiento,
      params.sexo,
      params.peso_kg,
      currentDate,
      params.reg_usuario,
    ]);

    return mascotaResult.insertId;
  } catch (err) {
    throw err;
  }
};

Mascota.actualizarMascota = async (params) => {
  try {
    const currentDate = new Date();
    const sql = `
            UPDATE mascotas SET
                nombre_mascota = ?,
                especie = ?,
                raza_id = ?,
                fecha_nacimiento = ?,
                sexo = ?,
                peso_kg = ?,
                act_fecha = ?,
                act_usuario = ?
            WHERE id_mascota = ?
            AND estado ='A'
        `;

    const [result] = await db.query(sql, [
      //params.cliente_id,
      params.nombre_mascota,
      params.especie,
      params.raza_id,
      params.fecha_nacimiento,
      params.sexo,
      params.peso_kg,
      currentDate,
      params.act_usuario,
      params.id_mascota, // el id de la mascota a actualizar
    ]);

    return result;
  } catch (err) {
    throw err;
  }
};

Mascota.eliminarMascota = async (eli_usuario, id_mascota) => {
  try {
    const currentDate = new Date();
    const sql = `
            UPDATE mascotas SET 
                estado = 'I', 
                eli_fecha = ?,
                eli_usuario = ?
            WHERE id_mascota = ?
        `;
    const [result] = await db.query(sql, [
      currentDate,
      eli_usuario,
      id_mascota,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

Mascota.verificarExistenciaMascota = async (
  nombre_mascota,
  especieId,
  razaId,
) => {
  try {
    const sql = `
            SELECT m.* 
            FROM mascotas m
            INNER JOIN clientes c ON m.cliente_id = c.id_cliente
            WHERE m.nombre_mascota = ? 
            AND m.especie = ? 
            AND m.raza_id = ? 
            AND m.estado = 'A'`;
    const [rows] = await db.query(sql, [nombre_mascota, especieId, razaId]);
    return rows;
  } catch (err) {
    throw err;
  }
};

Mascota.obtenerMascotaDeCliente = async (id_cliente) => {
  try {
    sql = `select r.nombre_raza, m.*
                from mascotas m
                inner join clientes c on m.cliente_id = c.id_cliente
                inner join razas r on m.raza_id = r.id_raza
                where c.id_cliente = ?
                and m.estado = 'A'
                and r.estado = 'A'
                `;
    const [rows] = await db.query(sql, [id_cliente]);
    return rows;
  } catch (error) {
    throw error;
  }
};

/*-------- Graficas -------*/
// Obtiene el total de mascotas atendidas por mes en un año específico
Mascota.obtenerMascotasAtendidasPorAño = async (anio) => {
  try {
    const sql = `
      SELECT 
        m.id_mes AS mes,
        m.descripcion AS mes_nombre,
        ? AS anio,
        COUNT(ds.cita_id) AS total
      FROM meses m
      LEFT JOIN detalle_servicios ds 
        ON MONTH(ds.fecha_hora_inicio) = m.id_mes 
        AND YEAR(ds.fecha_hora_inicio) = ?
      LEFT JOIN citas c 
        ON ds.cita_id = c.id_cita 
        AND c.estado_cita = 'Atendida'
      GROUP BY m.id_mes, m.descripcion
      ORDER BY m.id_mes;
    `;

    const [rows] = await db.query(sql, [anio, anio]);
    return rows;
  } catch (error) {
    throw error;
  }
};
// Obtiene el total de las especies de mascotas mas atendidas
Mascota.obtenerEspeciesMasAtendidas = async (anio) => {
  try {
    const sql = `
      SELECT 
        m.especie AS especie,
        COUNT(c.id_cita ) AS total_atenciones
      FROM mascotas m
      INNER JOIN citas c ON m.id_mascota = c.mascota_id
      INNER JOIN detalle_servicios ds ON c.id_cita = ds.cita_id
      WHERE YEAR(ds.fecha_hora_inicio) = ?
        AND c.estado_cita = 'Atendida'
      GROUP BY m.especie
      ORDER BY total_atenciones DESC;
    `;

    const [rows] = await db.query(sql, [anio]);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = Mascota;
