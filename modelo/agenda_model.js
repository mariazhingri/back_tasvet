const db = require('../config/conexion');
const agendaModel = {
    createUser: async (rol_id,nombre,email, clave,claveHash,estado,reg_fecha) => {
        try {
            const [result] = await db.promise().query(
                'INSERT INTO usuarios (rol_id,nombre, email, clave, clave_segura , estado,  reg_fecha, reg_usuario, act_fehca, act_uasurio, eli_fecha, eli_usuario) VALUES (?,?,?,?,?,?,?)',
                [rol_id,nombre,email, clave,claveHash,estado,reg_fecha]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },
}

module.exports = agendaModel;