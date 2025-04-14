const db = require('../config/conexion');

const UserModel = {
    findByUsername: async (params) => {
        try {
            const sql = 'SELECT * FROM usuarios WHERE email = ?';
            const [rows] = await db.promise().query(sql, [params.email]);
            return rows[0];
            
        } catch (error) {
            console.error('Error en findByUsername:', error);
            throw error;
        }
    },

    createUser: async (rol_id,nombre,email, clave,claveHash,estado,reg_fecha) => {
        try {
            const [result] = await db.promise().query(
                'INSERT INTO usuarios (rol_id,nombre, email, clave, clave_segura , estado, reg_fecha) VALUES (?,?,?,?,?,?,?)',
                [rol_id,nombre,email, clave,claveHash,estado,reg_fecha]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    validateCredentials: async (email, clave) => {
        try {
            const [rows] = await db.promise().query(
                'SELECT * FROM usuarios WHERE email = ? AND clave = ?',
                [email, clave]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = UserModel;