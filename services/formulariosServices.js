const Usuarios = require('../modelo/user_model');
const FormularioModel = require('../modelo/formularios_model');

module.exports = {

async crearCarnetVacuna(params){
    console.log('params service: ', params)
    console.log('params service: ', params.id_usuario)
    user = params.reg_usuario
    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && userRol.rol_id !== 2) {
        throw { status: 403, message: 'Acción no permitida' };
    }


    const formularioVacuna = await FormularioModel.crearCarnetVacuna({
        empleado_id: params.IdEmpleado,
        vacuna_id: params.IdVacuna,
        fecha_aplicacion: params.fechaAplicacion,
        peso_kg: params.pesoKg,
        edad_meses: params.edadMeses,
        proxima_dosis: params.proximaDosis,
        observaciones: params.observaciones,
        reg_usuario: params.reg_usuario
    });

    const eventoClinico = await FormularioModel.crearEventoClinico({
        carnet_vacuna_id: formularioVacuna,
        atencion_id: params.IdAtencion,
        carnet_spa_id: params.IdCarnetSpa,
        carnet_desparasitacion_id: params.IdCarnetDesparasitacion,
        reg_usuario: params.reg_usuario
    })

    const historialClinico = await FormularioModel.crearHistorialClinico({
        mascota_id: params.IdMascota,
        evento_clinico_id: eventoClinico,
        numero_historia_clinica: params.NumHistoriaClinica,
        antecedentes_veterinarios_id: params.AntecedentesVeterinarios,
        fecha: params.fecha
    })

    return {
        formularioVacuna,
        eventoClinico,
        historialClinico
    };
},

async crearCarnetDesparacitacion(params){
    console.log('params service: ', params)
    console.log('params service: ', params.id_usuario)
    user = params.reg_usuario

    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && userRol.rol_id !== 2) {
        throw { status: 403, message: 'Acción no permitida' };
    }

    const carnetDesparasitacion = await FormularioModel.crearCarnetDesparacitacion({
        empleado_id: params.IdEmpleado,
        antiparasitario_id: params.IdAntiparasitario,
        fecha_aplicacion: params.fechaAplicacion,
        peso_kg: params.pesoKg,
        edad_meses: params.edadMeses,
        proxima_dosis: params.proximaDosis,
        observaciones: params.observaciones,
        reg_usuario: params.reg_usuario
    });

    const eventoClinico = await FormularioModel.crearEventoClinico({
        carnet_vacuna_id: params.IdCarnetVacuna,
        atencion_id: params.IdAtencion,
        carnet_spa_id: params.IdCarnetSpa,
        carnet_desparasitacion_id: carnetDesparasitacion,
        reg_usuario: params.reg_usuario
    })

    const historialClinico = await FormularioModel.crearHistorialClinico({
        mascota_id: params.IdMascota,
        evento_clinico_id: eventoClinico,
        numero_historia_clinica: params.NumHistoriaClinica,
        antecedentes_veterinarios_id: params.AntecedentesVeterinarios,
        fecha: params.fecha
    })

    return {
        carnetDesparasitacion,
        eventoClinico,
        historialClinico
    };
},

async crearAtencionVeterinaria(params){
    console.log('params service: ', params)
    console.log('params service: ', params.id_usuario)
    user = params.reg_usuario

    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && userRol.rol_id !== 2) {
        throw { status: 403, message: 'Acción no permitida' };
    }

    const AtencionVeterinaria = await FormularioModel.crearAtencionVeterinaria({
        empleado_id: params.IdEmpleado,
        temperatura: params.temperatura,
        peso: params.pesoKg,
        edad_meses: params.edadMeses,
        sintomas: params.sintomas,
        diagnostico: params.diagnostico,
        tratamiento: params.tratamiento,
        resultados_examenes: params.resultados_examenes,
        observaciones: params.observaciones,
        reg_usuario: params.reg_usuario
    });

    const eventoClinico = await FormularioModel.crearEventoClinico({
        carnet_vacuna_id: params.IdCarnetVacuna,
        atencion_id: AtencionVeterinaria,
        carnet_spa_id: params.IdCarnetSpa,
        carnet_desparasitacion_id: params.IdcarnetDesparasitacion,
        reg_usuario: params.reg_usuario
    })

    const historialClinico = await FormularioModel.crearHistorialClinico({
        mascota_id: params.IdMascota,
        evento_clinico_id: eventoClinico,
        numero_historia_clinica: params.NumHistoriaClinica,
        antecedentes_veterinarios_id: params.AntecedentesVeterinarios,
        fecha: params.fecha
    })

    return {
        AtencionVeterinaria,
        eventoClinico,
        historialClinico
    };
},

async crearCarnetSpa(params){
    console.log('params service: ', params)
    console.log('params service: ', params.id_usuario)
    user = params.reg_usuario

    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && userRol.rol_id !== 2) {
        throw { status: 403, message: 'Acción no permitida' };
    }

    const carnetSpa = await FormularioModel.crearCarnetsSpa({
        empleado_id: params.IdEmpleado,
        peso_kg: params.pesoKg,
        edad_meses: params.edadMeses,
        corte_pelo: params.cortePelo,
        estilo: params.estilo,
        baño: params.baño,
        oidos: params.oidos,
        uñas: params.uñas,
        hora_inngreso: params.horaIngreso,
        hora_entrega: params.horaEntrega,
        observaciones: params.observaciones,
        reg_usuario: params.reg_usuario
    });

    const eventoClinico = await FormularioModel.crearEventoClinico({
        carnet_vacuna_id: params.IdCarnetVacuna,
        atencion_id: params.IdAtencion,
        carnet_spa_id: carnetSpa,
        carnet_desparasitacion_id: params.IdcarnetDesparasitacion,
        reg_usuario: params.reg_usuario
    })

    const historialClinico = await FormularioModel.crearHistorialClinico({
        mascota_id: params.IdMascota,
        evento_clinico_id: eventoClinico,
        numero_historia_clinica: params.NumHistoriaClinica,
        antecedentes_veterinarios_id: params.AntecedentesVeterinarios,
        fecha: params.fecha
    })

    return {
        carnetSpa,
        eventoClinico,
        historialClinico
    };
},


}