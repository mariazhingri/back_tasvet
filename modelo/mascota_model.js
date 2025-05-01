const db = require('../config/conexion');
const Usuarios = require('../modelo/user_model');
const Mascota = {};

const generarCodigoVinculacion = () => {
    const numeros = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    return `V-${numeros}`;
};

Mascota.crearMascota = async (params) => {
    const connection = await db.getConnection();
    try {
        // Obtener nombre del usuario que registra
        const nombreRegistrador = await Usuarios.getUserName(params.reg_usuario);

        await connection.beginTransaction();

         // Verificar si la mascota ya existe
         const verificarSQL = `
            SELECT m.* 
            FROM mascotas m
            INNER JOIN contactos c ON m.contacto_id = c.id_contacto
            WHERE m.nombre = ? 
            AND m.especie_id = ?
            AND c.nombre = ?
            AND c.apellido = ?
            AND m.estado = 'A'
        `;

        const [mascotasExistentes] = await connection.query(verificarSQL, [
            params.nombre_mascota,
            params.especie_id,
            params.nombre_contacto,
            params.apellido_contacto
        ]);

        if (mascotasExistentes.length > 0) {
            throw new Error('Ya existe una mascota registrada con el mismo nombre, especie y dueño');
        }

        // 1. Insertar contacto
        const contactoSQL = `
            INSERT INTO contactos (nombre, apellido, telefono, email, direccion, estado, reg_usuario)
            VALUES (?, ?, ?, ?, ?, 'A', ?)
        `;
        const [contactoResult] = await connection.query(contactoSQL, [
            params.nombre_contacto,
            params.apellido_contacto,
            params.telefono,
            params.email,
            params.direccion,
            nombreRegistrador
        ]);

        const contactoId = contactoResult.insertId;

        // 2. Insertar mascota
        const mascotaSQL = `
            INSERT INTO mascotas (
                contacto_id, nombre, especie_id, raza_id, 
                fecha_nacimiento, edad_meses, sexo, peso_kg, 
                color_pelaje, estado, reg_usuario
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'A', ?)
        `;
        const [mascotaResult] = await connection.query(mascotaSQL, [
            contactoId,
            params.nombre_mascota,
            params.especie_id,
            params.raza_id,
            params.fecha_nacimiento,
            params.edad_meses,
            params.sexo,
            params.peso_kg,
            params.color_pelaje,
            nombreRegistrador
        ]);

        const mascotaId = mascotaResult.insertId;

        // 3. Generar código de vinculación e insertar en vinculaciones_mascotas
        const codigoVinculacion = generarCodigoVinculacion();
        const vinculacionSQL = `
            INSERT INTO vinculaciones_mascotas (
                mascota_id, codigo_vinculacion, estado, reg_usuario
            )
            VALUES (?, ?, 'PENDIENTE', ?)
        `;
        await connection.query(vinculacionSQL, [
            mascotaId,
            codigoVinculacion,
            nombreRegistrador
        ]);

        await connection.commit();

        return {
            success: true,
            contacto_id: contactoId,
            mascota_id: mascotaId,
            codigo_vinculacion: codigoVinculacion
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

module.exports = Mascota;