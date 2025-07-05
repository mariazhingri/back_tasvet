const Usuarios = require("../modelo/user_model");
const FormularioModel = require("../modelo/formularios_model");
const ServiciosModel = require("../modelo/servicios_model");
const empleados = require("../modelo/empleado_model");
const CitaModel = require("../modelo/cita_model")
module.exports = {

    async crearCarnets(params) {
  const user = params.reg_usuario;
  const formularios = params.formularios;

  if (!Array.isArray(formularios)) {
    throw { status: 400, message: "No se enviaron formularios válidos" };
  }

  const userRol = await Usuarios.findUsuario({ id_usuario: user });
  if (userRol.rol_id !== 1 && userRol.rol_id !== 2 && userRol.rol_id !== 4) {
    throw { status: 403, message: "Acción no permitida" };
  }
  const empleado = await empleados.obtenerempleadoPorUsuario( user );
  console.log("empleado: ", empleado);
  const formulariosHabilitados = await ServiciosModel.obtenerFomularios();
  const disponibles = formulariosHabilitados.map(f => f.formulario);

  let formularioVacuna = null;
  let AtencionVeterinaria = null;
  let carnetDesparasitacion = null;
  let carnetSpa = null;

  for (const formulario of formularios) {
    const { IdFormulario } = formulario;

    if (!disponibles.includes(IdFormulario)) {
      throw { status: 400, message: `Formulario ${IdFormulario} no habilitado` };
    }

    if (IdFormulario === 1) {
      AtencionVeterinaria = await FormularioModel.crearAtencionVeterinaria({
        empleado_id: empleado[0].id_empleado,
        temperatura: formulario.temperatura,
        peso: formulario.pesoKg,
        edad_meses: formulario.edadMeses,
        sintomas: formulario.sintomas,
        diagnostico: formulario.diagnostico,
        tratamiento: formulario.tratamiento,
        resultados_examenes: formulario.resultados_examenes,
        observaciones: formulario.observaciones,
        reg_usuario: user,
      });
    } else if (IdFormulario === 2) {
      formularioVacuna = await FormularioModel.crearCarnetVacuna({
        empleado_id: empleado[0].id_empleado,
        vacuna_id: formulario.IdVacuna,
        fecha_aplicacion: formulario.fechaAplicacion,
        peso_kg: formulario.pesoKg,
        edad_meses: formulario.edadMeses,
        proxima_dosis: formulario.proximaDosis,
        observaciones: formulario.observaciones,
        reg_usuario: user,
      });
    } else if (IdFormulario === 3) {
      carnetDesparasitacion = await FormularioModel.crearCarnetDesparacitacion({
        empleado_id: empleado[0].id_empleado,
        antiparasitario_id: formulario.IdAntiparasitario,
        fecha_aplicacion: formulario.fechaAplicacion,
        peso_kg: formulario.pesoKg,
        edad_meses: formulario.edadMeses,
        proxima_dosis: formulario.proximaDosis,
        observaciones: formulario.observaciones,
        reg_usuario: user,
      });
    } else if (IdFormulario === 4) {
      carnetSpa = await FormularioModel.crearCarnetsSpa({
        empleado_id: empleado[0].id_empleado,
        peso_kg: formulario.pesoKg,
        edad_meses: formulario.edadMeses,
        corte_pelo: formulario.cortePelo,
        estilo: formulario.estilo,
        baño: formulario.baño,
        oidos: formulario.oidos,
        uñas: formulario.uñas,
        hora_ingreso: formulario.horaIngreso,
        hora_entrega: formulario.horaEntrega,
        observaciones: formulario.observaciones,
        reg_usuario: user,
      });
    }
  }

  console.log({
  formularioVacuna,
  AtencionVeterinaria,
  carnetSpa,
  carnetDesparasitacion,
});

  const eventoClinico = await FormularioModel.crearEventoClinico({
    carnet_vacuna_id: formularioVacuna ,
    atencion_id: AtencionVeterinaria ,
    carnet_spa_id: carnetSpa ,
    carnet_desparasitacion_id: carnetDesparasitacion,
    reg_usuario: user,
  });

  const siguienteNumero = await FormularioModel.calcularNumeroHistoriaClinica({ mascota_id: formularios[0].IdMascota });

  const historialClinico = await FormularioModel.crearHistorialClinico({
    mascota_id: formularios[0].IdMascota,
    evento_clinico_id: eventoClinico,
    numero_historia_clinica: siguienteNumero,
    antecedentes_veterinarios_id: formularios[0].AntecedentesVeterinarios || null,
    fecha: new Date()
  });

  await CitaModel.actualizarEstadoCita(formularios[0].IdCita);

  
  

  return {
    formularioVacuna,
    eventoClinico,
    historialClinico,
  };
},

  async crearCarnetDesparacitacion(params) {
    console.log("params service: ", params);
    console.log("params service: ", params.id_usuario);
    user = params.reg_usuario;

    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && userRol.rol_id !== 2) {
      throw { status: 403, message: "Acción no permitida" };
    }

    const carnetDesparasitacion =
      await FormularioModel.crearCarnetDesparacitacion({
        empleado_id: params.IdEmpleado,
        antiparasitario_id: params.IdAntiparasitario,
        fecha_aplicacion: params.fechaAplicacion,
        peso_kg: params.pesoKg,
        edad_meses: params.edadMeses,
        proxima_dosis: params.proximaDosis,
        observaciones: params.observaciones,
        reg_usuario: params.reg_usuario,
      });

    const eventoClinico = await FormularioModel.crearEventoClinico({
      carnet_vacuna_id: params.IdCarnetVacuna,
      atencion_id: params.IdAtencion,
      carnet_spa_id: params.IdCarnetSpa,
      carnet_desparasitacion_id: carnetDesparasitacion,
      reg_usuario: params.reg_usuario,
    });
    const siguienteNumero = await FormularioModel.calcularNumeroHistoriaClinica({ mascota_id: params.IdMascota });
    const numeroHistoria = siguienteNumero; 

    const historialClinico = await FormularioModel.crearHistorialClinico({
      mascota_id: params.IdMascota,
      evento_clinico_id: eventoClinico,
      numero_historia_clinica: numeroHistoria,
      antecedentes_veterinarios_id: params.AntecedentesVeterinarios,
      fecha: params.fecha,
    });

    return {
      carnetDesparasitacion,
      eventoClinico,
      historialClinico,
    };
  },

  async crearAtencionVeterinaria(params) {
    console.log("params service: ", params);
    console.log("params service: ", params.id_usuario);
    user = params.reg_usuario;

    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && userRol.rol_id !== 2) {
      throw { status: 403, message: "Acción no permitida" };
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
      reg_usuario: params.reg_usuario,
    });

    const eventoClinico = await FormularioModel.crearEventoClinico({
      carnet_vacuna_id: params.IdCarnetVacuna,
      atencion_id: AtencionVeterinaria,
      carnet_spa_id: params.IdCarnetSpa,
      carnet_desparasitacion_id: params.IdcarnetDesparasitacion,
      reg_usuario: params.reg_usuario,
    });
    const siguienteNumero = await FormularioModel.calcularNumeroHistoriaClinica({ mascota_id: params.IdMascota });
    const numeroHistoria = siguienteNumero; 

    const historialClinico = await FormularioModel.crearHistorialClinico({
      mascota_id: params.IdMascota,
      evento_clinico_id: eventoClinico,
      numero_historia_clinica: numeroHistoria,
      antecedentes_veterinarios_id: params.AntecedentesVeterinarios,
      fecha: params.fecha,
    });

    return {
      AtencionVeterinaria,
      eventoClinico,
      historialClinico,
    };
  },

  async crearCarnetSpa(params) {
    console.log("params service: ", params);
    console.log("params service: ", params.id_usuario);
    user = params.reg_usuario;

    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && userRol.rol_id !== 2) {
      throw { status: 403, message: "Acción no permitida" };
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
      reg_usuario: params.reg_usuario,
    });

    const eventoClinico = await FormularioModel.crearEventoClinico({
      carnet_vacuna_id: params.IdCarnetVacuna,
      atencion_id: params.IdAtencion,
      carnet_spa_id: carnetSpa,
      carnet_desparasitacion_id: params.IdcarnetDesparasitacion,
      reg_usuario: params.reg_usuario,
    });

    const siguienteNumero = await FormularioModel.calcularNumeroHistoriaClinica({ mascota_id: params.IdMascota });
    const numeroHistoria = siguienteNumero; 

    const historialClinico = await FormularioModel.crearHistorialClinico({
      mascota_id: params.IdMascota,
      evento_clinico_id: eventoClinico,
      numero_historia_clinica: numeroHistoria,
      antecedentes_veterinarios_id: params.AntecedentesVeterinarios,
      fecha: params.fecha,
    });

    return {
      carnetSpa,
      eventoClinico,
      historialClinico,
    };
  },


};
