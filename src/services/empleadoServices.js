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
  }


}
