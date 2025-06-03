const db = require('../config/conexion');

const Usuarios = {}
Usuarios.cambiarRol = async () => {
    try {
        const id_usuario_admin = 1; // ID del administrador que realiza la acción
        const id_usuario = 5; // ID del usuario cuyo rol será cambiado
        const nuevo_rol_id = 2; // Nuevo rol (por ejemplo, veterinario)

        await Usuarios.changeUserRole(id_usuario_admin, id_usuario, nuevo_rol_id);
        console.log('Rol cambiado exitosamente');
    } catch (error) {
        console.error('Error al cambiar el rol:', error.message);
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
            where.push('u.id_usuario = ?');
            queryParams.push(params.id_usuario);
        }
        if (params.correo) {
            where.push('p.correo = ?');
            queryParams.push(params.correo);
        }
        if (params.cedula) {
            where.push('p.cedula = ?');
            queryParams.push(params.cedula);
        }

        if (where.length === 0) {
            throw new Error('Se requiere al menos un parámetro para buscar el usuario');
        }

        sql += ' WHERE ' + where.join(' AND ');

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
                    'A', 
                    currentDate,
                    datosUsuario.reg_usuario
                ]
            );
            personaId = personaResult.insertId;
        }

        // Insertar en la tabla usuarios
        const [usuarioResult] = await connection.query(
            `INSERT INTO usuarios (persona_id, clave, rol_id, estado, reg_fecha, reg_usuario) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                personaId,
                datosUsuario.clave, 
                rol_id, 
                'A', 
                currentDate,
                datosUsuario.reg_usuario
            ]
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

Usuarios.updateUser = async (id_usuario, datosUsuario, usuario_actualizador) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const currentDate = new Date();

        // Actualizar tabla personas si hay datos de persona
        if (datosUsuario.persona && datosUsuario.persona.id_persona) {
            await connection.query(
                `UPDATE personas SET correo = ?, nombre = ?, apellido = ?, telefono_1 = ?, telefono_2 = ?, act_fecha = ?, act_usuario = ?
                 WHERE id_persona = ?`,
                [
                    datosUsuario.persona.correo || null,
                    datosUsuario.persona.nombre,
                    datosUsuario.persona.apellido,
                    datosUsuario.persona.telefono_1,
                    datosUsuario.persona.telefono_2 || null,
                    currentDate,
                    usuario_actualizador,
                    datosUsuario.persona.id_persona
                ]
            );
        }

        // Verificar si existe el usuario
        let usuarioExiste = false;
        if (id_usuario) {
            const [rows] = await connection.query(
                'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
                [id_usuario]
            );
            usuarioExiste = rows.length > 0;
        }

        if (usuarioExiste) {
            // Actualizar usuario existente
            let datosUsuarioUpdate = {
                clave: datosUsuario.clave,
                act_fecha: currentDate,
                act_usuario: usuario_actualizador
            };
            Object.keys(datosUsuarioUpdate).forEach(key => datosUsuarioUpdate[key] === undefined && delete datosUsuarioUpdate[key]);

            await connection.query(
                'UPDATE usuarios SET ? WHERE id_usuario = ?',
                [datosUsuarioUpdate, id_usuario]
            );
        } else if (datosUsuario.persona && datosUsuario.clave) {
            // Crear usuario si no existe y hay datos suficientes
            await connection.query(
                `INSERT INTO usuarios (persona_id, clave, rol_id, estado, reg_fecha, reg_usuario)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    datosUsuario.persona.id_persona,
                    datosUsuario.clave,
                    3, 
                    'A',
                    currentDate,
                    usuario_actualizador
                ]
            );
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

Usuarios.deleteUser = async (nombre, usuario_eliminador) => {
    try {
        const currentDate = new Date();
        const nombreEliminador = await Usuarios.getUserName(usuario_eliminador);
        const [result] = await db.query(
            'UPDATE usuarios SET estado = "I", eli_fecha = ?, eli_usuario = ? WHERE id_usuario = ?',
            [currentDate, nombreEliminador, nombre]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = Usuarios;
