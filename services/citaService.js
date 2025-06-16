const CitaModel = require('../modelo/cita_model');

module.exports = {

    async crearCita(params){
        try{
             // 1️⃣ Validar campos obligatorios
            const camposObligatorios = ['id_cliente', 'id_mascota', 'id_servicio', 'fechaHora'];
            for (let campo of camposObligatorios) {
                if (!params[campo]) {
                    return { success: false, message: `El campo ${campo} es obligatorio.` };
                }
            }

            // 2️⃣ Validar que la fecha sea válida
            const fechaHora = new Date(params.fechaHora);
            //fechaHora.setHours(fechaHora.getHours() - 5); // ajustar según tu zona
            if (isNaN(fechaHora)) {
                return { success: false, message: "La fechaHora no tiene un formato válido." };
            }

            // 3️⃣ Validar que la fecha no sea pasada
            if (fechaHora < new Date()) {
                return { success: false, message: "No se pueden agendar citas en el pasado." };
            }

            // 4️⃣ Validar duplicados (empleado, fecha y hora exacta)
           const fechaHoraMysql = fechaHora.toISOString().slice(0, 16).replace('T', ' '); // solo hasta minutos
            
            const citaExistente = await CitaModel.buscarCitaPorFechaHoraEmpleado(
                params.fechaHora  
            );
            if (Array.isArray(citaExistente) && citaExistente.length > 0) {
    return { success: false, message: "Ya existe una cita en ese horario" };
}


            const citaId = await CitaModel.crearCita({
                cliente_id: params.id_cliente,
                mascota_id: params.id_mascota,
                servicio_id: params.id_servicio,
                fecha_hora_cita: params.fechaHora,
                reg_usuario: params.reg_usuario
            })
                                                                                                                                                   
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