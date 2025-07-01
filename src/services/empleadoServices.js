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

}
