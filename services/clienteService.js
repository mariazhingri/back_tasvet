const Clientes = require('../modelo/cliente_model')

module.exports = {

   async getClients (id_usuario) {
        if (!id_usuario) {
            throw { status: 401, message: 'Usuario no autenticado' };
        }
        const params = { id_usuario };
        const clientes = await Clientes.datosCliente(params);

        return clientes;
    },

    async createClientPet (body, usuario_creador) {

        // Validar campos requeridos
        // if (!body ) {
        //     throw { status: 400, message: 'Datos incompletos para crear el cliente' };
        // }

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
            nombre: body.nombre_mascota,
            especie: body.especie,
            raza: body.raza,
            sexo: body.sexo,
            peso_kg: body.peso_kg,
            fecha_nacimiento: body.fecha_nacimiento,
            direccion: body.direccion,
            cedula: body.cedula,
            correo: body.correo,
            nombreCliente: body.nombreCliente,
            apellido: body.apellidoCliente,
            telefono_1: body.telefono_1,
            telefono_2: body.telefono_2 || null,
            estado: "A",
            reg_usuario: usuario_creador,

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
            cedula: body.cedula,
            correo: body.correo,
            nombre: body.nombre,
            apellido: body.apellido,
            telefono_1: body.telefono_1,
            telefono_2: body.telefono_2 || null,
            estado: "A",
            reg_usuario: usuario_actualizador,
            id_persona: body.id_persona

        });

        return clienteActualizado;
    },

    async deleteClient (id_cliente, usuario_eliminador){

        if (usuario_eliminador !== 1 && usuario_eliminador !== 2) {
            throw { status: 403, message: 'No tiene permisos para eliminar este cliente' };
        }
        if (!id_cliente) {
            throw { status: 400, message: 'Falta el ID del cliente' };
        }

        const ClienteEliminado = await Clientes.deleteClient(id_cliente)

        return ClienteEliminado;
    }

};