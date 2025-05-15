const db = require('../config/conexion');

const Clientes = {}

Clientes.datosCliente = async (params) => {
    try {
        sql = `select p.nombre, p.apellido, r.descripcion as rol
                from personas p
                inner join usuarios u on p.id_persona = u.persona_id
                inner join roles r on u.rol_id = r.id_rol
                where u.id_usuario = ?`;
        const [rows] = await db.query(sql, [params.id_usuario]);
        if (rows.length === 0) {
            return null; // No se encontró el cliente
        }
        return rows[0]; 
    }catch (error) {
        throw error;
    }
}

Clientes.createCliente = async (params) => {
    try {
        const { nombre, apellido, cedula, telefono, email, direccion, reg_usuario } = params;

        // Crear la persona
        const sqlPersona = `
            INSERT INTO personas (nombre, apellido, cedula, telefono, email, estado, reg_usuario)
            VALUES (?, ?, ?, ?, ?, 'A', ?)`;
        const [personaResult] = await db.query(sqlPersona, [nombre, apellido, cedula, telefono, email, reg_usuario]);

        const personaId = personaResult.insertId;

        // Crear el cliente asociado a la persona
        const sqlCliente = `
            INSERT INTO clientes (persona_id, direccion, estado, reg_usuario)
            VALUES (?, ?, 'A', ?)`;
        const [clienteResult] = await db.query(sqlCliente, [personaId, direccion, reg_usuario]);

        return clienteResult.insertId;
    } catch (error) {
        throw error;
    }
}

module.exports = Clientes;