const EmpleadoModel = require("../modelo/empleado_model");

module.exports = {
  async obtenerCitasPorEmpleados(params) {
    // if (!params.id_usuario) {
    //   throw { status: 401, message: "Usuario no autenticado" };
    // }
    const CitasPorEmpelados = await EmpleadoModel.obtenerCitasPorEmpleados({
      empleado_id: params.IdEmpleado
    });

    return CitasPorEmpelados;
  },

  async obtenerCitasPorUsuarioId(id_usuario) {
    if (!id_usuario) {
      throw { status: 401, message: "Usuario no autenticado" };
    }
    const CitasPorEmpelados = await EmpleadoModel.obtenerCitasPorUsuarioId(id_usuario);

    return CitasPorEmpelados;
  },


  async obtenerCitasPorRangoFecha(id_usuario, fechaInicio, fechaFin) {
    if (!id_usuario) {
      throw { status: 401, message: "Usuario no autenticado" };
    }
    const citasFiltradas = await EmpleadoModel.obtenerCitasPorRangoFecha(id_usuario, fechaInicio, fechaFin);

    return citasFiltradas;
  },

  async obtenerCitasPorUsuarioIdV2(id_usuario) {
    if (!id_usuario) {
      throw { status: 401, message: "Usuario no autenticado" };
    }
    const CitasPorEmpelados = await EmpleadoModel.obtenerCitasPorUsuarioIdV2(id_usuario);

    return CitasPorEmpelados;
  },


  //------Graficas ------
  async obtenerTotalCitasAtendidasPorMes(anio) {
    const CitasPorEmpelados = await EmpleadoModel.obtenerTotalCitasAtendidasPorMes(anio);
    console.log("Citas por empleados:", CitasPorEmpelados);
    // Agrupar por empleado
    const resultado = {};

    CitasPorEmpelados.forEach(item => {
      const nombre = item.empleado;
      const mes = item.mes - 1; // Ajustar para que enero sea 0
      const total = item.total_citas;

      if (!resultado[nombre]) {
        resultado[nombre] = [];
      }

      resultado[nombre].push({ mes, total });
    });
    console.log("Resultado agrupado por empleado:", resultado);

    return resultado;
  },


  //--------SOLO PARA VETERINARIOS-------------

  async obtenerCitas(id_usuario) {
    try {
      const filas = await EmpleadoModel.obtenerCitas(id_usuario);
      const agrupadas = agruparCitas(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },

  async obtenerCitasRetrasadasVet(id_usuario) {
    try {
      const filas = await EmpleadoModel.obtenerCitasRetrasadas(id_usuario);
      const agrupadas = agruparCitas(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },

  async obtenerCitasCanceladasVet(id_usuario) {
    try {
      const filas = await EmpleadoModel.obtenerCitasCanceladas(id_usuario);
      const agrupadas = agruparCitas(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },

  async obtenerCitasAtendidaVet(id_usuario) {
    try {
      const filas = await EmpleadoModel.obtenerCitasAtendidas(id_usuario);
      const agrupadas = agruparCitas(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },

}

const agruparCitas = (filas) => {
  return filas.map(row => ({
    id_cita: row.id_cita,
    estado_cita: row.estado_cita,

    id_mascota: row.id_mascota,
    nombre_mascota: row.nombre_mascota,
    especie: row.especie,
    nombre_raza: row.nombre_raza,
    fecha_nacimiento: row.fecha_nacimiento,

    nombre: row.nombre,
    apellido: row.apellido,
    telefono: row.telefono_1,
    direccion: row.direccion,

    servicios: JSON.parse(`[${row.servicios}]`) // <- parseamos el string JSON en array
  }));
};

const objetoCita = (row) => ({
  id_cita: row.id_cita,
  estado_cita: row.estado_cita,
  id_mascota: row.id_mascota,
  nombre_mascota: row.nombre_mascota,
  especie: row.especie,
  nombre_raza: row.nombre_raza,
  fecha_nacimiento: row.fecha_nacimiento,
  nombre: row.nombre,
  apellido: row.apellido,
  telefono: row.telefono_1,
  direccion: row.direccion,
  servicios: JSON.parse(`[${row.servicios}]`),
});


