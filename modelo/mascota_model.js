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
}

Mascota.verificarExistenciaMascota = async ( nombre, especieId, razaId) => {
    try{
        const sql =`
            SELECT m.* 
            FROM mascotas m
            INNER JOIN clientes c ON m.cliente_id = c.id_cliente
            WHERE m.nombre = ? 
            AND m.especie = ? 
            AND m.raza_id = ? 
            AND m.estado = 'A'`;
            const [rows] = await db.query(sql, [nombre, especieId, razaId]);
    return rows;
    }catch(err) {
        throw err;
    }
};

Mascota.CreatMascota = async (params) => {
    
    const sql = `INSERT INTO mascotas (
        cliente_id, nombre, especie, raza_id, 
        fecha_nacimiento, sexo, peso_kg, estado, reg_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'A', ?)`;
    const [result] = await db.query(sql,[
        params.cliente_id, params.nombre, params.especie,
        params.raza_id, params.fecha_nacimiento, params.sexo,
        params.peso_kg, params.reg_usuario
    ]);
    return result.insertId;
};

Mascota.updateMascota = async (params) => {
    const currentDate = new Date();
    const sql = `
        UPDATE mascotas SET
            nombre = ?,
            especie = ?,
            raza_id = ?,
            fecha_nacimiento = ?,
            sexo = ?,
            peso_kg = ?,
            act_fecha = ?,
            act_usuario = ?
        WHERE id_mascota = ? 
        AND estado = 'A'
    `;

    const [result] = await db.query(sql, [
        params.nombre,
        params.especie,
        params.raza_id,
        params.fecha_nacimiento,
        params.sexo,
        params.peso_kg,
        currentDate,
        params.act_usuario,     // ← usuario que edita
        params.id_mascota       // ← ID de la mascota a actualizar
    ]);

    return result.affectedRows > 0;
};

Mascota.getRazas = async() => {
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

Mascota.deleteMascota = async( id_mascota, eli_usuario) =>{
    try {
        const currentDate = new Date();
        const sql = `
            UPDATE mascotas
            SET estado = 'I', eli_fecha = ?, eli_usuario = ?
            WHERE id_mascota = ?`;
        const [result] = await db.query(
            sql, 
            [currentDate, eli_usuario, id_mascota]);

        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

Mascota.obtenerMascotaDeCliente = async (id_cliente) => {
    try {
        sql = `select m.*
                from mascotas m
                inner join clientes c on m.cliente_id = c.id_cliente
                where c.id_cliente = ?
                and m.estado = 'A'
                `;
        const [rows] = await db.query(sql,[id_cliente]);
        return rows; 
    }catch (error) {
        throw error;
    }
}

module.exports = Mascota;