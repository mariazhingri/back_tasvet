const MascotaModel = require('../modelo/mascota_model');
const PersonaModel = require('../modelo/persona_model');
const ClienteModel = require('../modelo/cliente_model');


module.exports = {

    async asignarNuevaMascotaACliente  (params){
         try {
            // 1. Actualizar persona
            const personaActualizada = await PersonaModel.actualizarPersona({
            correo: params.correo,
            apellido: params.apellidoCliente,
            nombre: params.nombre,
            telefono_1: params.telefono_1,
            telefono_2: params.telefono_2,
            act_usuario: params.act_usuario,
            id_persona: params.persona_id,
            });
            //console.log("Data que va al modelo: ", personaActualizada)

            if (!personaActualizada) {
            return {
                success: false,
                message: 'No se pudo actualizar los datos de la persona'
            };
            }

            // 2. Actualizar cliente
            const clienteActualizado = await ClienteModel.actualizarCliente({
            id_cliente: params.cliente_id,
            persona_id: params.persona_id,
            direccion: params.direccion,
            act_usuario: params.act_usuario
            });

            if (!clienteActualizado) {
            return {
                success: false,
                message: 'No se pudo actualizar los datos del cliente'
            };
            }
             // 2.1 Verificar existencia de mascota
            const existentes = await MascotaModel.verificarExistenciaMascota(
                params.nombre_mascota,
                params.especie,
                params.raza
            );
    
            if (existentes.length > 0) {
                throw new Error('Ya existe una mascota registrada con el mismo nombre, especie y raza.');
            }
            
            
            // 3. Crear nueva mascota
            const mascotaId = await MascotaModel.crearMascota({
            cliente_id: params.cliente_id,
            nombre_mascota: params.nombre_mascota,
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

    async actualizarMascota(params){
        // Validar permisos
         if (params.act_usuario !== 1 && params.act_usuario !== 2) {
            throw { status: 403, message: 'No tiene permisos para actualizar este cliente' };
        }


        const resultado = await MascotaModel.actualizarMascota({
            id_mascota: params.id_mascota,
            nombre_mascota: params.nombre_mascota,
            especie: params.especie,
            raza_id: params.raza,
            sexo: params.sexo,
            peso_kg: params.peso_kg,
            fecha_nacimiento: params.fechaNac,
            act_usuario: params.act_usuario,
        });

       

        if (resultado === 0) {
            throw { status: 404, message: 'Servicio no encontrado' };
        }
         return { id_mascota: params.id_mascota };
    },

    async eliminarMascota (id_mascota, usuario_eliminador){
    
        if (usuario_eliminador !== 1 && usuario_eliminador !== 2) {
            throw { status: 403, message: 'No tiene permisos para eliminar esta mascota' };
        }
        if (!id_mascota) {
            throw { status: 400, message: 'Falta el ID de la  mascota' };
        }

        const MascotaEliminada = await MascotaModel.eliminarMascota(usuario_eliminador,id_mascota )

        return MascotaEliminada;
    },
    
}