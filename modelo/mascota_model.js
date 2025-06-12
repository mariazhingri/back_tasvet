const db = require('../config/conexion');
const Usuarios = require('../modelo/user_model');
const Mascota = {};


Mascota.crearMascota1 = async(params) => {
    try{
        const currentDate = new Date();
        const sql = `
            INSERT INTO mascotas (
                cliente_id, nombre, especie_id, raza_id, 
                fecha_nacimiento, sexo, peso_kg, 
                estado, reg_usuario
            )
            VALUES (?, ?, ?, ?, ?, ?, ?,'A', ?)
        `;
        const [mascotaResult] = await db.query(sql, [
            clienteId,
            params.nombre_mascota,
            params.especie_id,
            params.raza_id,
            params.fecha_nacimiento,
            params.sexo,
            params.peso_kg,
            params.reg_usuario
        ]);

        const mascotaId = mascotaResult.insertId;
    }catch(err){
        throw err;
    }
        
}

Mascota.crearMascota = async (params) => {
    const connection = await db.getConnection();
    try {
        // Obtener nombre del usuario que registra
         const currentDate = new Date();

        await connection.beginTransaction();

         // Verificar si la mascota ya existe ppara un cliente
         const verificarSQL = `
            SELECT m.* 
            FROM mascotas m
            INNER JOIN clientes c ON m.cliente_id = c.id_cliente
            WHERE m.nombre = ?
            AND m.especie_id = ?
            AND m.raza_id = ?
            AND m.estado = 'A'
        `;

        const [mascotasExistentes] = await connection.query(verificarSQL, [
            params.nombre_mascota,
            params.especie_id,
            params.raza_id
        ]);

        if (mascotasExistentes.length > 0) {
            throw new Error('Ya existe una mascota registrada con el mismo nombre, especie y raza para este cliente.');
        }

        // 1. Insertar cliente
        const personaSQL = `
            INSERT INTO personas (cedula, nombre, apellido, telefono, estado, reg_fecha, reg_usuario)
            VALUES (?, ?, ?, ?, 'A', ? ,?)
        `;
        const [personaResult] = await connection.query(personaSQL, [
            params.cedula,
            params.nombre_cliente,
            params.apellido_cliente,
            params.telefono,
            currentDate,
            params.reg_usuario
        ]);

        const personaId = personaResult.insertId;

        // 2. Insertar cliente
        const clienteSQL = `
            INSERT INTO clientes (persona_id, direccion,estado, reg_fecha, reg_usuario)
            VALUES (?, ?,'A', ?, ?)
        `;
        const [clienteResult] = await connection.query(clienteSQL, [
            personaId,
            params.direccion,
            currentDate,
            params.reg_usuario
        ]);
        const clienteId = clienteResult.insertId;

        // 3. Insertar mascota
        const mascotaSQL = `
            INSERT INTO mascotas (
                cliente_id, nombre, especie_id, raza_id, 
                fecha_nacimiento, sexo, peso_kg, 
                estado, reg_usuario
            )
            VALUES (?, ?, ?, ?, ?, ?, ?,'A', ?)
        `;
        const [mascotaResult] = await connection.query(mascotaSQL, [
            clienteId,
            params.nombre_mascota,
            params.especie_id,
            params.raza_id,
            params.fecha_nacimiento,
            params.sexo,
            params.peso_kg,
            params.reg_usuario
        ]);

        const mascotaId = mascotaResult.insertId;

        await connection.commit();

        return {
            success: true,
            persona_id: personaId,
            cliente_id: clienteId,
            mascota_id: mascotaId,
        };

    } catch (error) {
        await connection.rollback();
        return {
            success: false,
            error: error.message
        };
    } finally {
        connection.release();
    }
};
                
Mascota.updateMascota = async (mascota_id, params, usuario_actualizador) => {
    const connection = await db.getConnection();
    try {
        // Obtener nombre del usuario que actualiza
        const nombreActualizador = await Usuarios.getUserName(usuario_actualizador);
        
        await connection.beginTransaction();

        // 1. Actualizar datos del contacto
        const contactoSQL = `
            UPDATE contactos c
            INNER JOIN mascotas m ON m.contacto_id = c.id_contacto
            SET 
                c.nombre = ?,
                c.apellido = ?,
                c.telefono = ?,
                c.email = ?,
                c.direccion = ?,
                c.act_fecha = NOW(),
                c.act_usuario = ?
            WHERE m.id_mascota = ? AND c.estado = 'A'
        `;
        await connection.query(contactoSQL, [
            params.nombre_contacto,
            params.apellido_contacto,
            params.telefono,
            params.email,
            params.direccion,
            nombreActualizador,
            mascota_id
        ]);

        // 2. Actualizar datos de la mascota
        const mascotaSQL = `
            UPDATE mascotas 
            SET 
                nombre = ?,
                especie_id = ?,
                raza_id = ?,
                fecha_nacimiento = ?,
                edad_meses = ?,
                sexo = ?,
                peso_kg = ?,
                color_pelaje = ?,
                act_fecha = NOW(),
                act_usuario = ?
            WHERE id_mascota = ? AND estado = 'A'
        `;
        const [mascotaResult] = await connection.query(mascotaSQL, [
            params.nombre_mascota,
            params.especie_id,
            params.raza_id,
            params.fecha_nacimiento,
            params.edad_meses,
            params.sexo,
            params.peso_kg,
            params.color_pelaje,
            nombreActualizador,
            mascota_id
        ]);

        if (mascotaResult.affectedRows === 0) {
            throw new Error('No se encontró la mascota o no está activa');
        }

        await connection.commit();

        return {
            success: true,
            message: 'Mascota actualizada exitosamente',
            mascota_id: mascota_id
        };

    } catch (error) {
        await connection.rollback();
        return {
            success: false,
            error: error.message
        };
    } finally {
        connection.release();
    }
};

Mascota.deleteMascota = async (mascota_id, usuario_eliminador) => {
    const connection = await db.getConnection();
    try {
        // Obtener nombre del usuario que elimina
        const nombreEliminador = await Usuarios.getUserName(usuario_eliminador);
        
        await connection.beginTransaction();

        // 1. Marcar contacto como inactivo
        const contactoSQL = `
            UPDATE contactos c
            INNER JOIN mascotas m ON m.contacto_id = c.id_contacto
            SET 
                c.estado = 'I',
                c.eli_fecha = NOW(),
                c.eli_usuario = ?
            WHERE m.id_mascota = ? AND c.estado = 'A'
        `;
        await connection.query(contactoSQL, [nombreEliminador, mascota_id]);

        // 2. Marcar mascota como inactiva
        const mascotaSQL = `
            UPDATE mascotas 
            SET 
                estado = 'I',
                eli_fecha = NOW(),
                eli_usuario = ?
            WHERE id_mascota = ? AND estado = 'A'
        `;
        const [mascotaResult] = await connection.query(mascotaSQL, [nombreEliminador, mascota_id]);

        if (mascotaResult.affectedRows === 0) {
            throw new Error('No se encontró la mascota o ya está inactiva');
        }

        // 3. Marcar vinculaciones como inactivas
        const vinculacionSQL = `
            UPDATE vinculaciones_mascotas 
            SET 
                estado = 'INACTIVO',
                eli_fecha = NOW(),
                eli_usuario = ?
            WHERE mascota_id = ? AND estado = 'PENDIENTE'
        `;
        await connection.query(vinculacionSQL, [nombreEliminador, mascota_id]);

        await connection.commit();

        return {
            success: true,
            message: 'Mascota eliminada exitosamente',
            mascota_id: mascota_id
        };

    } catch (error) {
        await connection.rollback();
        return {
            success: false,
            error: error.message
        };
    } finally {
        connection.release();
    }
};


module.exports = Mascota;