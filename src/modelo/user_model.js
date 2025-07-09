const db = require("../config/conexion");

const Usuarios = {};
Usuarios.cambiarRol = async () => {
  try {
    const id_usuario_admin = 1; // ID del administrador que realiza la acción
    const id_usuario = 5; // ID del usuario cuyo rol será cambiado
    const nuevo_rol_id = 2; // Nuevo rol (por ejemplo, veterinario)

    await Usuarios.changeUserRole(id_usuario_admin, id_usuario, nuevo_rol_id);
    console.log("Rol cambiado exitosamente");
  } catch (error) {
    console.error("Error al cambiar el rol:", error.message);
  }
};

Usuarios.findUsuario = async (params) => {
  try {
    let sql = `
            SELECT p.*, u.*, r.descripcion as rol_descripcion
            FROM personas p
            LEFT JOIN usuarios u ON p.id_persona = u.persona_id
            LEFT JOIN roles r ON u.rol_id = r.id_rol
        `;
    let where = [];
    let queryParams = [];

    if (params.id_usuario) {
      where.push("u.id_usuario = ?");
      queryParams.push(params.id_usuario);
    }
    if (params.correo) {
      where.push("p.correo = ?");
      queryParams.push(params.correo);
    }
    if (params.cedula) {
      where.push("p.cedula = ?");
      queryParams.push(params.cedula);
    }

    if (where.length === 0) {
      throw new Error(
        "Se requiere al menos un parámetro para buscar el usuario",
      );
    }

    sql += " WHERE " + where.join(" AND ");

    const [rows] = await db.query(sql, queryParams);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

Usuarios.createUser = async (datosUsuario) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const currentDate = new Date();
    const rol_id = 3;

    let personaId = null;

    // Insertar en la tabla personas si se proporcionan datos adicionales
    if (datosUsuario.persona) {
      const [personaResult] = await connection.query(
        `INSERT INTO personas (cedula,correo,nombre, apellido, telefono_1,telefono_2, estado, reg_fecha, reg_usuario) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          datosUsuario.persona.cedula,
          datosUsuario.persona.correo || null,
          datosUsuario.persona.nombre,
          datosUsuario.persona.apellido,
          datosUsuario.persona.telefono_1,
          datosUsuario.persona.telefono_2 || null,
          "A",
          currentDate,
          datosUsuario.reg_usuario,
        ],
      );
      personaId = personaResult.insertId;
    }

    // 2. Insertar cliente
    if (personaId) {
      await connection.query(
        `INSERT INTO clientes (persona_id, direccion, estado, reg_fecha, reg_usuario)
         VALUES (?, ?, ?, ?, ?)`,
        [
          personaId,
          datosUsuario.direccion,
          "A",
          currentDate,
          datosUsuario.reg_usuario,
        ],
      );
    }

    // Insertar en la tabla usuarios
    const [usuarioResult] = await connection.query(
      `INSERT INTO usuarios (persona_id, clave, rol_id, estado, reg_fecha, reg_usuario) 
             VALUES (?, ?, ?, ?, ?, ?)`,
      [
        personaId,
        datosUsuario.clave,
        rol_id,
        "A",
        currentDate,
        datosUsuario.reg_usuario,
      ],
    );

    const usuarioId = usuarioResult.insertId;

    await connection.commit();
    return { id_usuario: usuarioId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

Usuarios.createUserAdministrador = async (datosUsuario) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const currentDate = new Date();
    const rol_id = 1;

    let personaId = null;

    if (datosUsuario.persona) {
      const [personaResult] = await connection.query(
        `INSERT INTO personas (cedula, correo, nombre, apellido, telefono_1, telefono_2, estado, reg_fecha, reg_usuario) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          datosUsuario.persona.cedula,
          datosUsuario.persona.correo || null,
          datosUsuario.persona.nombre,
          datosUsuario.persona.apellido,
          datosUsuario.persona.telefono_1,
          datosUsuario.persona.telefono_2 || null,
          "A",
          currentDate,
          datosUsuario.reg_usuario,
        ],
      );
      personaId = personaResult.insertId;
    }

    const [usuarioResult] = await connection.query(
      `INSERT INTO usuarios (persona_id, clave, rol_id, estado, reg_fecha, reg_usuario) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        personaId,
        datosUsuario.clave,
        rol_id,
        "A",
        currentDate,
        datosUsuario.reg_usuario,
      ],
    );

    await connection.commit();
    return { id_usuario: usuarioResult.insertId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

Usuarios.updateUser = async (id_usuario, datos, usuario_actualizador) => {
  try {
    const currentDate = new Date();
    const nombreActualizador = await Usuarios.getUserName(usuario_actualizador);
    const [result] = await db.query(
      "UPDATE usuarios SET ? , act_fecha = ?, act_usuario = ? WHERE id_usuario = ?",
      [datos, currentDate, nombreActualizador, id_usuario],
    );
    return result;
  } catch (error) {
    throw error;
  }
};

Usuarios.deleteUser = async (nombre, usuario_eliminador) => {
  try {
    const currentDate = new Date();
    const nombreEliminador = await Usuarios.getUserName(usuario_eliminador);
    const [result] = await db.query(
      'UPDATE usuarios SET estado = "I", eli_fecha = ?, eli_usuario = ? WHERE id_usuario = ?',
      [currentDate, nombreEliminador, nombre],
    );
    return result;
  } catch (error) {
    throw error;
  }
};

Usuarios.findEmpleado = async (params) => {
  try {
    let sql = `
            SELECT e.id_empleado
            FROM personas p
            INNER JOIN empleados e ON p.id_persona = e.persona_id
            INNER JOIN usuarios u ON p.id_persona = u.persona_id
            where u.id_usuario = ?
        `;

    const [rows] = await db.query(sql, [params.id_usuario]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};


Usuarios.createUserAux = async (datosUsuario) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const currentDate = new Date();
    const rol_id = 4; // Auxiliar

    let personaId = null;

    // 1. Insertar en personas
    if (datosUsuario.persona) {
      const [personaResult] = await connection.query(
        `INSERT INTO personas (
            cedula, correo, nombre, apellido,
            telefono_1, telefono_2,
            estado, reg_fecha, reg_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          datosUsuario.persona.cedula,
          datosUsuario.persona.correo || null,
          datosUsuario.persona.nombre,
          datosUsuario.persona.apellido,
          datosUsuario.persona.telefono_1,
          datosUsuario.persona.telefono_2 || null,
          "A",
          currentDate,
          datosUsuario.reg_usuario,
        ]
      );
      personaId = personaResult.insertId;
    } else {
      throw new Error("Datos de persona son requeridos");
    }

    // 2. Insertar en usuarios
    const [usuarioResult] = await connection.query(
      `INSERT INTO usuarios (
          persona_id, clave, rol_id,
          estado, reg_fecha, reg_usuario
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        personaId,
        datosUsuario.clave,
        rol_id,
        "A",
        currentDate,
        datosUsuario.reg_usuario,
      ]
    );

    const usuarioId = usuarioResult.insertId;

    // 3. Insertar en empleados
    await connection.query(
      `INSERT INTO empleados (
          persona_id, cargo, descripcion,
          estado, reg_fecha, reg_usuario
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        personaId,
        'Auxiliar',
        'Soporte administrativo y asistencial',
        'A',
        currentDate,
        datosUsuario.reg_usuario,
      ]
    );

    await connection.commit();

    return { id_usuario: usuarioId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
Usuarios.createUserVeterinario = async (datosUsuario) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const currentDate = new Date();
    const rol_id = 2; // Veterinario

    // 1. Insertar persona
    const [personaResult] = await connection.query(
      `INSERT INTO personas (
          cedula, correo, nombre, apellido,
          telefono_1, telefono_2,
          estado, reg_fecha, reg_usuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datosUsuario.persona.cedula,
        datosUsuario.persona.correo || null,
        datosUsuario.persona.nombre,
        datosUsuario.persona.apellido,
        datosUsuario.persona.telefono_1,
        datosUsuario.persona.telefono_2 || null,
        'A',
        currentDate,
        datosUsuario.reg_usuario,
      ]
    );
    const personaId = personaResult.insertId;

    // 2. Insertar usuario
    const [usuarioResult] = await connection.query(
      `INSERT INTO usuarios (
          persona_id, clave, rol_id,
          estado, reg_fecha, reg_usuario
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        personaId,
        datosUsuario.clave,
        rol_id,
        'A',
        currentDate,
        datosUsuario.reg_usuario,
      ]
    );
    const usuarioId = usuarioResult.insertId;

    // 3. Insertar empleado
    await connection.query(
      `INSERT INTO empleados (
          persona_id, cargo, descripcion,
          estado, reg_fecha, reg_usuario
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        personaId,
        'Veterinario',
        'Atención médica veterinaria',
        'A',
        currentDate,
        datosUsuario.reg_usuario,
      ]
    );

    await connection.commit();

    return { id_usuario: usuarioId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// -------RECUPERAR CLAVE--------------

Usuarios.cambiarClave = async (params) => {
  console.log("cambiar clave modelo: ", params);
  try {
    const sql = `
        UPDATE usuarios u
        JOIN personas p ON u.persona_id = p.id_persona
        SET u.clave = ?
        WHERE p.correo = ?;
    `;
    const [result] = await db.query(sql, [params.clave, params.correo]);
    return result;
  } catch (err) {
    throw err;
  }
};
// HACER UNA INSERCION A LA TABLA USUARIOS
Usuarios.crearUsuario = async (params) => {
  console.log("crear Usuario: ", params);
  try {
    const currentDate = new Date()
    const sql = `
        INSERT INTO usuarios (
                  rol_id,
                  persona_id,
                  clave,
                  estado,
                  reg_fecha,
                  reg_usuario
                ) VALUES (?,?,?,?,?,?)
    `;
    const [result] = await db.query(sql, [
      params.rol_id, 
      params.persona_id,
      params.clave,
      'A',
      currentDate,
      params.reg_usuario
    ]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = Usuarios;
