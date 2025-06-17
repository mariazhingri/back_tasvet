const db = require('../config/conexion');
const Usuarios = require('../modelo/user_model');

const Mascota = {};

Mascota.obtenerMascota = async() => {
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

Mascota.obtenerRazas = async() => {
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
}

Mascota.crearMascota = async(params) => {
    try{
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
            params.reg_usuario
        ]);

        return mascotaResult.insertId;
    }catch(err){
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
            params.id_mascota  // el id de la mascota a actualizar
        ]);

        return result;
    } catch (err) {
        throw err;
    }
};

Mascota.eliminarMascota = async (eli_usuario, id_mascota ) => {
    try {
        const currentDate = new Date()
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
            id_mascota
        ]);
        return result;
    } catch (err) {
        throw err;
    }
};

Mascota.verificarExistenciaMascota = async ( nombre_mascota, especieId, razaId) => {
    try{
        const sql =`
            SELECT m.* 
            FROM mascotas m
            INNER JOIN clientes c ON m.cliente_id = c.id_cliente
            WHERE m.nombre_mascota = ? 
            AND m.especie = ? 
            AND m.raza_id = ? 
            AND m.estado = 'A'`;
            const [rows] = await db.query(sql, [nombre_mascota, especieId, razaId]);
    return rows;
    }catch(err) {
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
        const [rows] = await db.query(sql,[id_cliente]);
        return rows; 
    }catch (error) {
        throw error;
    }
}
module.exports = Mascota;
