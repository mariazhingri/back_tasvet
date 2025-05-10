const db = require('../config/conexion');

const Usuarios = {}
Usuarios.findByUsername = async (params) => {
    try {
        let sql, queryParams;
        
        if (params.id_usuario) {
            sql = `
                SELECT u.*, r.descripcion as rol_descripcion 
                FROM usuarios u 
                LEFT JOIN roles r ON u.rol_id = r.id_rol 
                WHERE u.id_usuario = ?`;
            queryParams = [params.id_usuario];
        }else if (params.nombre) {
            sql = `
                SELECT u.*, r.descripcion as rol_descripcion 
                FROM usuarios u 
                LEFT JOIN roles r ON u.rol_id = r.id_rol 
                WHERE u.nombre = ?`;
            queryParams = [params.nombre];
        }else if (params.email) {
            sql = `
                SELECT u.*, r.descripcion as rol_descripcion 
                FROM usuarios u 
                LEFT JOIN roles r ON u.rol_id = r.id_rol 
                WHERE u.email = ?`;
            queryParams = [params.email];
        } else {
            throw new Error('Se requiere id_usuario o email para buscar el usuario');
        }

        const [rows] = await db.query(sql, queryParams);
        return rows[0];
    } catch (error) {
        throw error;
    }
},
Usuarios.getUserName = async (id_usuario) => {
    try {
        const usuario = await Usuarios.findByUsername({ id_usuario });
        return usuario ? usuario.nombre : 'Sistema';
    } catch (error) {
        throw error;
    }
},

Usuarios.createUser = async (nombre, email, clave, claveHash, telefono) => {
    try {
        const currentDate = new Date();
        const estado = 'A'; 
        const rol_id = 3; // rol por defecto
        const [result] = await db.query(
            'INSERT INTO usuarios (rol_id, nombre, email, clave, clave_segura, telefono, estado, reg_fecha, reg_usuario) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)',
            [rol_id, nombre, email, clave, claveHash, telefono, estado, currentDate, nombre]
        );
        return result;
    } catch (error) {
        throw error;
    }
},

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