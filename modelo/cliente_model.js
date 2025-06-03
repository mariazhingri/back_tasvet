const db = require('../config/conexion');

const Clientes = {}

Clientes.datosUsuario = async (params) => {
    try {
        sql = `select p.*, r.descripcion as rol
                from personas p
                inner join usuarios u on p.id_persona = u.persona_id
                inner join roles r on u.rol_id = r.id_rol
                where u.id_usuario = ?
                and u.estado = 'A'`;
        const [rows] = await db.query(sql, [params.id_usuario]);
        if (rows.length === 0) {
            return null; // No se encontró el cliente
        }
        return rows[0]; 
    }catch (error) {
        throw error;
    }
}

Clientes.datosCliente = async (params) => {
    try {
        sql = `select c.id_cliente, p.nombre, p.apellido, p.cedula, p.telefono_1, p.telefono_2, p.correo, c.direccion
                from clientes c
                inner join personas p on c.persona_id = p.id_persona
                and c.estado = 'A'
                `;
        const [rows] = await db.query(sql);
        return rows; 
    }catch (error) {
        throw error;
    }
}

Clientes.createClientPet = async (params) => {
    try {
        const currentDate = new Date();
        const { nombre, apellido, cedula, telefono_1,telefono_2, correo, direccion, reg_usuario } = params;
        // Crear la persona
        const sqlPersona = `
            INSERT INTO personas (nombre, apellido, cedula, telefono_1,telefono_2, correo, estado, reg_fecha, reg_usuario)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [personaResult] = await db.query(sqlPersona, 
            [
                nombre, 
                apellido, 
                cedula, 
                telefono_1, 
                telefono_2, 
                correo, 
                'A',
                currentDate,
                reg_usuario
            ]);
        const personaId = personaResult.insertId;

        // Crear el cliente asociado a la persona
        const sqlCliente = `
            INSERT INTO clientes (persona_id, direccion, estado, reg_fecha,reg_usuario)
            VALUES (?, ?, ?, ?, ?)`;
        const [clienteResult] = await db.query(sqlCliente, 
            [
                personaId, 
                direccion,
                'A',
                currentDate, 
                reg_usuario
            ]);
        const clienteId = clienteResult.insertId;

        const sqlPet = `
            INSERT INTO mascotas (cliente_id, nombre, especie, raza_id, fecha_nacimiento,sexo,peso_kg, estado, reg_fecha, reg_usuario)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?)`;
        const [petResult] = await db.query(sqlPet, 
            [
                clienteId, 
                params.nombre_mascota, 
                params.especie, 
                params.raza_id, 
                params.fecha_nacimiento,
                params.sexo,
                params.peso_kg,
                'A',
                currentDate,
                reg_usuario
            ]);
        return petResult.insertId;
    } catch (error) {
        throw error;
    }
}

Clientes.updateClient = async (params) => {
    try {
        const currentDate = new Date();
        const { id_persona, id_cliente, nombre, apellido, cedula, telefono_1, telefono_2, correo, direccion, reg_usuario } = params;

        // Actualizar persona
        const sqlPersona = `
            UPDATE personas 
            SET cedula = ?, correo = ?, nombre = ?, apellido = ?, telefono_1 = ?, telefono_2 = ?, act_fecha = ?, act_usuario = ?
            WHERE id_persona = ?`;
        await db.query(sqlPersona, [
            cedula,
            correo,
            nombre,
            apellido,
            telefono_1,
            telefono_2,
            currentDate,
            reg_usuario,
            id_persona
        ]);

        // Actualizar cliente
        const sqlCliente = `
            UPDATE clientes 
            SET direccion = ?, act_fecha = ?, act_usuario = ?
            WHERE id_cliente = ?`;
        await db.query(sqlCliente, [
            direccion,
            currentDate,
            reg_usuario,
            id_cliente
        ]);

        return true;
    } catch (err) {
        throw err;
    }
}

module.exports = Clientes;