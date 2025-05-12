const db = require('../config/conexion');

const Clientes = {}

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