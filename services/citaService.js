const CitaModel = require('../modelo/cita_model');

module.exports = {

    async crearCita(params){
        try{
             // 1️⃣ Validar campos obligatorios
            const camposObligatorios = ['cliente_id', 'mascota_id', 'empleado_id', 'servicio_id', 'fechaHora', 'reg_usuario'];
            for (let campo of camposObligatorios) {
                if (!params[campo]) {
                    return { success: false, message: `El campo ${campo} es obligatorio.` };
                }
            }

            // 2️⃣ Validar que la fecha sea válida
            const fechaHora = new Date(params.fechaHora);
            if (isNaN(fechaHora)) {
                return { success: false, message: "La fechaHora no tiene un formato válido." };
            }

            // 3️⃣ Validar que la fecha no sea pasada
            if (fechaHora < new Date()) {
                return { success: false, message: "No se pueden agendar citas en el pasado." };
            }

            // 4️⃣ Validar duplicados (empleado, fecha y hora exacta)
            const fechaHoraMysql = fechaHora.toISOString().slice(0, 19).replace('T', ' ');
            const citaExistente = await CitaModel.buscarCitaPorFechaHoraEmpleado(
                params.empleado_id,
                fechaHoraMysql
            );
            if (citaExistente) {
                return { success: false, message: "Ya existe una cita en ese horario para el empleado." };
            }

            // 5️⃣ Validar existencia de registros relacionados (esto asume que ya tenés métodos en el modelo)
            const clienteExiste = await ClienteModel.buscarPorId(params.cliente_id);
            if (!clienteExiste) return { success: false, message: "El cliente no existe." };

            const mascotaExiste = await MascotaModel.buscarPorId(params.mascota_id);
            if (!mascotaExiste) return { success: false, message: "La mascota no existe." };

            const empleadoExiste = await EmpleadoModel.buscarPorId(params.empleado_id);
            if (!empleadoExiste) return { success: false, message: "El empleado no existe." };

            const servicioExiste = await ServicioModel.buscarPorId(params.servicio_id);
            if (!servicioExiste) return { success: false, message: "El servicio no existe." };

            const citaId = await CitaModel.crearCita({
                cliente_id: params.cliente_id,
                mascota_id: params.mascota_id,
                empleado_id: params.empleado_id,
                servicio_id: params.servicio_id,
                fecha_hora_cita: params.fechaHora,
                reg_usuario: params.reg_usuario
            })
            //console.log('va para el modelo: ', citaId);

        return {
            success: true,
            cita_id:citaId
        }
        }catch(err){
            return {
                success: false,
                message: err.message
            };
        }
    },

}