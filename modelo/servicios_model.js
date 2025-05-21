const db = require('../config/conexion');
const Usuarios = require('./user_model');

const Servicios = {}

Servicios.crearServicio = async (params) => {
    try {
        const currentDate = new Date();

        const sql = `
            INSERT INTO servicios (descripcion, categoria, estado, reg_fecha,reg_usuario)
            VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(
            sql, 
            [params.descripcion, params.categoria, 'A', currentDate, params.reg_usuario]);

        return result.insertId; // Devuelve el ID del nuevo servicio creado
    } catch (error) {
        throw error;
    }
}

Servicios.obtenerServicios = async () => {
    try {
        // Consulta para obtener los servicios (descripcion y categoria) que estan resgistrados en la base de datos   
        const sql = `
            select s.id_servicio, s.descripcion, s.categoria
            from servicios s
            inner join usuarios u on s.reg_usuario = u.id_usuario`;
        const [rows] = await db.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = Servicios;