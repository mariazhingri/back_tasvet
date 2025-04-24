const db = require('../config/conexion');

const Usuarios = {}
Usuarios.findByUsername = async (params) => {
    try {
        let sql, queryParams;
        
        if (params.id_usuario) {
            sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
            queryParams = [params.id_usuario];
        } else if (params.email) {
            sql = 'SELECT * FROM usuarios WHERE email = ?';
            queryParams = [params.email];
        } else {
            throw new Error('Se requiere id_usuario o email para buscar el usuario');
        }

        const [rows] = await db.promise().query(sql, queryParams);
        return rows[0];
    } catch (error) {
        throw error;
    }
},

Usuarios.createUser = async (rol_id, nombre, email, clave, claveHash) => {
    try {
        const currentDate = new Date();
        const estado = 'A'; 
        const [result] = await db.promise().query(
            'INSERT INTO usuarios (rol_id, nombre, email, clave, clave_segura, estado, reg_fecha, reg_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [rol_id, nombre, email, clave, claveHash, estado, currentDate, nombre]
        );
        return result;
    } catch (error) {
        throw error;
    }
},

Usuarios.updateUser = async (id_usuario, datos, usuario_actualizador) => {
    try {
        const currentDate = new Date();
        const [result] = await db.promise().query(
            'UPDATE usuarios SET ? , act_fecha = ?, act_usuario = ? WHERE id_usuario = ?',
            [datos, currentDate, usuario_actualizador, id_usuario]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

Usuarios.deleteUser = async (id_usuario, usuario_actualizador) => {
    try {
        const currentDate = new Date();
        const [result] = await db.promise().query(
            'UPDATE usuarios SET estado = "I", eli_fecha = ?, eli_usuario = ? WHERE id_usuario = ?',
            [currentDate, usuario_actualizador, id_usuario]
        );
        return result;
    } catch (error) {
        throw error;
    }
}


module.exports = Usuarios;