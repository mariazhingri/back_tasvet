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
Usuarios.findByUsername = async (params) => {
    try {
        //console.log('Parámetros recibidos en findByUsername:', params); // Depuración
        let sql, queryParams;
        
        if (params.id_usuario) {
            sql = `
                SELECT u.*, r.descripcion as rol_descripcion 
                FROM usuarios u 
                LEFT JOIN roles r ON u.rol_id = r.id_rol 
                WHERE u.id_usuario = ?`;
            queryParams = [params.id_usuario];
        }else if (params.email) {
            sql = `
                SELECT u.*
                FROM usuarios u 
                WHERE  u.email = ?`;
            queryParams = [params.email];
        }else if (params.cedula) {
            sql = `SELECT * FROM personas WHERE cedula = ?`;
            queryParams = [params.cedula];
        } else {
            throw new Error('Se requiere id_usuario o email para buscar el usuario');
        }

        const [rows] = await db.query(sql, queryParams);
        return rows[0];
    } catch (error) {
        throw error;
    }
},
Usuarios.findByCedula = async (cedula) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM personas WHERE cedula = ?',
            [cedula]
        );
        return rows[0]; // Retorna el primer resultado o undefined si no existe
    } catch (error) {
        throw error;
    }
};
Usuarios.getUserName = async (id_usuario) => {
    try {
        if (!id_usuario) {
            return 'Sistema'; // Si no hay id_usuario, devolver "Sistema"
        }
        const usuario = await Usuarios.findByUsername({ id_usuario });
        return usuario ? usuario.nombre : 'Sistema';
    } catch (error) {
        throw error;
    }
};

Usuarios.createUsuario = async (data, usuarioCreador) => {
    try {

        const currentDate = new Date();
        const nombreCreador = await Usuarios.getUserName(usuarioCreador || 'Sistema');
        const rol_id = 3;
        
        const [result] = await db.query(
            `INSERT INTO usuarios (persona_id, email, clave, rol_id,estado, reg_fecha, reg_usuario) 
                 VALUES (?, ?, ?, ?, ?, ?,?)`,
            [
                data.persona_id,
                data.email,
                data.clave, 
                rol_id, 
                'A', 
                currentDate,
                nombreCreador
            ]
        );
        return { insertId: result.insertId };
    } catch (error) {
        throw error;
    }
};

Usuarios.createPersonaYUsuario = async (datosUsuario, usuarioCreador) => {
    const connection = await db.getConnection(); 
    try {
        await connection.beginTransaction(); 

        const currentDate = new Date();
        const nombreCreador = await Usuarios.getUserName(usuarioCreador);
        const rol_id = 3;

        let personaId = null;

        // Insertar en la tabla personas si se proporcionan datos adicionales
        if (datosUsuario.persona) {
            const [personaResult] = await connection.query(
                `INSERT INTO personas (cedula, nombre, apellido, telefono, estado, reg_fecha, reg_usuario) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    datosUsuario.persona.cedula,
                    datosUsuario.persona.nombre,
                    datosUsuario.persona.apellido,
                    datosUsuario.persona.telefono,
                    'A', 
                    currentDate,
                    nombreCreador
                ]
            );
            personaId = personaResult.insertId;
        }

        // Insertar en la tabla usuarios
        const [usuarioResult] = await connection.query(
            `INSERT INTO usuarios (persona_id, email, clave, rol_id, estado, reg_fecha, reg_usuario) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                personaId,
                datosUsuario.email,
                datosUsuario.clave, 
                rol_id, 
                'A', 
                currentDate,
                nombreCreador
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

Usuarios.changeUserRole = async (id_usuario_admin, id_usuario, nuevo_rol_id) => {
    const connection = await db.getConnection(); // Obtener conexión para transacción
    try {
        await connection.beginTransaction(); // Iniciar transacción

        // Verificar que el usuario que realiza la acción es administrador
        const [adminUser] = await connection.query(
            'SELECT rol_id FROM usuarios WHERE id_usuario = ?',
            [id_usuario_admin]
        );
        if (!adminUser.length || adminUser[0].rol_id !== 1) {
            throw new Error('Acción no permitida: Solo un administrador puede cambiar roles.');
        }

        // Obtener el rol actual del usuario cuyo rol será cambiado
        const [usuario] = await connection.query(
            'SELECT rol_id FROM usuarios WHERE id_usuario = ?',
            [id_usuario]
        );
        if (!usuario.length) throw new Error('Usuario no encontrado');
        const rol_actual = usuario[0].rol_id;

        // Actualizar el rol en la tabla usuarios
        await connection.query(
            'UPDATE usuarios SET rol_id = ? WHERE id_usuario = ?',
            [nuevo_rol_id, id_usuario]
        );

        // Manejar tablas específicas
        if (rol_actual === 3 && nuevo_rol_id === 2) { // De cliente a veterinario
            // Eliminar de clientes
            await connection.query('DELETE FROM clientes WHERE persona_id = (SELECT id_persona FROM personas WHERE usuario_id = ?)', [id_usuario]);
            // Insertar en veterinarios
            await connection.query(
                'INSERT INTO veterinarios (persona_id, especialidad, estado, reg_fecha, reg_usuario) VALUES ((SELECT id_persona FROM personas WHERE usuario_id = ?), ?, ?, ?, ?)',
                [id_usuario, null, 'A', new Date(), 'sistema']
            );
        } else if (rol_actual === 2 && nuevo_rol_id === 3) { // De veterinario a cliente
            // Eliminar de veterinarios
            await connection.query('DELETE FROM veterinarios WHERE persona_id = (SELECT id_persona FROM personas WHERE usuario_id = ?)', [id_usuario]);
            // Insertar en clientes
            await connection.query(
                'INSERT INTO clientes (persona_id, direccion, estado, reg_fecha, reg_usuario) VALUES ((SELECT id_persona FROM personas WHERE usuario_id = ?), ?, ?, ?, ?)',
                [id_usuario, null, 'A', new Date(), 'sistema']
            );
        }

        await connection.commit(); // Confirmar transacción
    } catch (error) {
        await connection.rollback(); // Revertir transacción en caso de error
        throw error;
    } finally {
        connection.release(); // Liberar conexión
    }
};

Usuarios.updateUser = async (id_usuario, datos, usuario_actualizador) => {
    try {
        const currentDate = new Date();
        const nombreActualizador = await Usuarios.getUserName(usuario_actualizador);
        const [result] = await db.query(
            'UPDATE usuarios SET ? , act_fecha = ?, act_usuario = ? WHERE id_usuario = ?',
            [datos, currentDate, nombreActualizador, id_usuario]
        );
        return result;
    } catch (error) {
        throw error;
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