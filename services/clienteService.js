const Clientes = require('../modelo/cliente_model')

module.exports = {

   async getClients (id_usuario) {
        if (!id_usuario) {
            throw { status: 401, message: 'Usuario no autenticado' };
        }
        const params = { id_usuario };
        const clientes = await Clientes.datosCliente(params);

        // const clientes = rawData.map(row => ({
        //         id_cliente: row.id_cliente,
        //         direccion: row.direccion,
        //         persona: {
        //         id_persona: row.id_persona,
        //         nombre: row.nombre,
        //         apellido: row.apellido,
        //         cedula: row.cedula,
        //         correo: row.correo,
        //         telefono_1: row.telefono_1,
        //         telefono_2: row.telefono_2,
        //         },
        //     }));

        return clientes;
    },

    async createClientPet (body, usuario_creador) {

        // Validar campos requeridos
        if (!body || !body.cliente || !body.cliente.persona) {
            throw { status: 400, message: 'Datos incompletos para crear el cliente' };
        }

        // Validar autenticación
        if (!usuario_creador) {
            throw { status: 401, message: 'Usuario no autenticado' };
        }

        // Verificar permisos
        if (usuario_creador !== 1 && usuario_creador !== 2) {
            if (usuario_creador !== id_usuario) {
                throw { status: 403, message: 'Solo puede registrar clientes para su propio usuario' };
            }
        }

        // Construcción del objeto para enviarlo a la base de datos
        //console.log(JSON.stringify(body.cliente.persona, null, 2));

        const clienteConMascota = await Clientes.createClientPet ({
            nombre: body.nombre,
            especie: body.especie,
            raza: body.raza,
            sexo: body.sexo,
            peso_kg: body.peso_kg,
            fecha_nacimiento: body.fecha_nacimiento,
            cliente: {
                direccion: body.cliente.direccion,
                persona: {
                    cedula: body.cliente.persona.cedula,
                    correo: body.cliente.persona.correo,
                    nombre: body.cliente.persona.nombre,
                    apellido: body.cliente.persona.apellido,
                    telefono_1: body.cliente.persona.telefono_1,
                    telefono_2: body.cliente.persona.telefono_2 || null,
                    estado: "A",
                    reg_usuario: usuario_creador,
                },
            },
        });
        return clienteConMascota;
    },

    async updateClient (body, usuario_actualizador) {

        // Validar permisos
        if (usuario_actualizador !== 1 && usuario_actualizador !== 2) {
            throw { status: 403, message: 'No tiene permisos para actualizar este cliente' };
        }

        const clienteActualizado = await Clientes.updateClient({
            id_cliente: body.id_cliente,
            direccion: body.direccion,
                persona: {
                    cedula: body.persona.cedula,
                    correo: body.persona.correo,
                    nombre: body.persona.nombre,
                    apellido: body.persona.apellido,
                    telefono_1: body.persona.telefono_1,
                    telefono_2: body.persona.telefono_2 || null,
                    estado: "A",
                    reg_usuario: usuario_actualizador,
                    id_persona: body.persona.id_persona
                },
        });

        return clienteActualizado;
    }

};