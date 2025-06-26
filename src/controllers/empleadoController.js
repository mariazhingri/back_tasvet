const EmpleadoServices = require("../services/empleadoServices");

module.exports = {
  async obtenerCitasPorEmpleados(req, res) {
    console.log("Iniciando obtenerCitasPorEmpleados");
    try {
      const id_usuario = req.user?.id_usuario;
      const body = req.body
      const params = {
        ...body,
        reg_usuario: id_usuario
      };
      const CitasPorEmpleado = await EmpleadoServices.obtenerCitasPorEmpleados(params);

      res.status(200).json({
        success: true,
        data: CitasPorEmpleado,
      });
    } catch (error) {
      console.error(error); // Registrar el error en el servidor
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

}
