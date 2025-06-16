const ClienteModel = require('../modelo/cliente_model');
const MascotaModel = require('../modelo/mascota_model');
const PersonaModel = require('../modelo/persona_model');

module.exports = {

    async obtenerDatosClientes (id_usuario) {
            if (!id_usuario) {
                throw { status: 401, message: 'Usuario no autenticado' };
            }
            const params = { id_usuario };
            const clientes = await ClienteModel.obtenerDatosCliente(params);

            return clientes;
        },

    async crearMascotayCliente(params){     
        // 1. Verificar existencia de mascota
        const existentes = await MascotaModel.verificarExistenciaMascota(
            params.nombre_mascota,
            params.especie,
            params.raza_id
        );

        if (existentes.length > 0) {
            throw new Error('Ya existe una mascota registrada con el mismo nombre, especie y raza.');
        }

        // 2. Insertar persona
        const personaData = {
            cedula: params.cedula,
            nombre: params.nombreCliente,
            correo: params.correo,
            apellido: params.apellidoCliente,
            telefono_1: params.telefono_1,
            telefono_2: params.telefono_2,
            reg_usuario: params.reg_usuario
        };
        const personaId = await PersonaModel.crearPersona(personaData);

        // 3. Insertar cliente
        const clienteData = {
            persona_id: personaId,
            direccion: params.direccion,
            reg_usuario: params.reg_usuario
        };
        const clienteId = await ClienteModel.crearCliente(clienteData);

        // 4. Insertar mascota
        const mascotaData = {
            cliente_id: clienteId,
            nombre_mascota: params.nombre_mascota,
            especie: params.especie,
            raza_id: params.raza,
            fecha_nacimiento: params.fecha_nacimiento,
            sexo: params.sexo,
            peso_kg: params.peso_kg,
            reg_usuario: params.reg_usuario
        };
        const mascotaId = await MascotaModel.crearMascota(mascotaData);

        return {
            persona_id: personaId,
            cliente_id: clienteId,
            mascota_id: mascotaId
        };
    },

    async eliminarCliente (id_cliente, usuario_eliminador){

        if (usuario_eliminador !== 1 && usuario_eliminador !== 2) {
            throw { status: 403, message: 'No tiene permisos para eliminar este cliente' };
        }
        if (!id_cliente) {
            throw { status: 400, message: 'Falta el ID del cliente' };
        }

        const ClienteEliminado = await ClienteModel.eliminarCliente(id_cliente)

        return ClienteEliminado;
    },
    async actualizarCliente (params) {

        // Validar permisos
        if (params.act_usuario !== 1 && params.act_usuario !== 2) {
            throw { status: 403, message: 'No tiene permisos para actualizar este cliente' };
        }

        const PersonaActualizada = await PersonaModel.actualizarPersona({
            id_persona: params.id_persona,
            correo: params.correo,
            nombre: params.nombre,
            apellido: params.apellido,
            telefono_1: params.telefono_1,
            telefono_2: params.telefono_2 || null,
        })

        const clienteActualizado = await ClienteModel.actualizarCliente({
            id_cliente: params.id_cliente,
            direccion: params.direccion,
            act_usuario: params.ract_usuario,
        });


        return {
            persona_id: PersonaActualizada,
            cliente_id: clienteActualizado,
        };
    },


};