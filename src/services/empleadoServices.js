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
  }
}