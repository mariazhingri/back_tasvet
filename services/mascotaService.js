const MascotaModel = require('../modelo/mascota_model');
const PersonaModel = require('../modelo/persona_model');
const ClienteModel = require('../modelo/cliente_model');


module.exports = {
    async createPet(params){
        
        const currentDate = new Date();
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
            nombre: params.nombre_cliente,
            apellido: params.apellido_cliente,
            telefono_1: params.telefono_1,
            telefono_2: params.telefono_2,
            estado: 'A',
            reg_fecha: currentDate,
            reg_usuario: params.reg_usuario
        };
        const personaId = await PersonaModel.crearPersona(personaData);

        // 3. Insertar cliente
        const clienteData = {
            persona_id: personaId,
            direccion: params.direccion,
            estado: 'A',
            reg_fecha: currentDate,
            reg_usuario: params.reg_usuario
        };
        const clienteId = await ClienteModel.crearcliente(clienteData);

        // 4. Insertar mascota
        const mascotaData = {
            cliente_id: clienteId,
            nombre: params.nombre_mascota,
            especie: params.especie,
            raza_id: params.raza_id,
            fecha_nacimiento: params.fecha_nacimiento,
            sexo: params.sexo,
            peso_kg: params.peso_kg,
            estado: 'A',
            reg_usuario: params.reg_usuario
        };
        const mascotaId = await MascotaModel.CreatMascota(mascotaData);

        return {
            persona_id: personaId,
            cliente_id: clienteId,
            mascota_id: mascotaId
        };
    },

    async asignarNuevaMascotaACliente  (params){
         try {
            // 1. Actualizar persona
            const personaActualizada = await PersonaModel.updatePersona({
            id_persona: params.persona_id,
            nombre: params.nombreCliente,
            apellido: params.apellidoCliente,
            correo: params.correo,
            telefono_1: params.telefono_1,
            telefono_2: params.telefono_2,
            act_usuario: params.act_usuario
            });

            if (!personaActualizada) {
            return {
                success: false,
                message: 'No se pudo actualizar los datos de la persona'
            };
            }

            // 2. Actualizar cliente
            const clienteActualizado = await ClienteModel.updateCliente({
            id_cliente: params.cliente_id,
            personaId: params.persona_id,
            direccion: params.direccion,
            act_usuario: params.act_usuario
            });

            if (!clienteActualizado) {
            return {
                success: false,
                message: 'No se pudo actualizar los datos del cliente'
            };
            }

            // 3. Crear nueva mascota
            const mascotaId = await MascotaModel.CreatMascota({
            cliente_id: params.cliente_id,
            nombre: params.nombre_mascota,
            especie: params.especie,
            raza_id: params.raza,
            fecha_nacimiento: params.fecha_nacimiento,
            sexo: params.sexo,
            peso_kg: params.peso_kg,
            reg_usuario: params.reg_usuario
            });

            return {
            success: true,
            mascota_id: mascotaId
            };

        } catch (error) {
            return {
            success: false,
            message: error.message
            };
  }
    },

    async UpdateMascota(body,usuario_actualizador ){
        // Validar permisos
        if (usuario_actualizador !== 1 && usuario_actualizador !== 2) {
            throw { status: 403, message: 'No tiene permisos para actualizar este cliente' };
        }

        const resultado = await MascotaModel.updateMascota({
            id_mascota: body.nombre_mascota,
            especie: body.especie,
            raza_id: body.raza,
            sexo: body.sexo,
            peso_kg: body.peso_kg,
            fecha_nacimiento: body.fechaNac,
            act_usuario: usuario_actualizador,
        });

        if (resultado === 0) {
            throw { status: 404, message: 'Servicio no encontrado' };
        }
    }
}