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


  async obtenerCitasPorIdUsuario(req, res) {
    try {
      console.log("Iniciando obtenerCitasPorUsuario");
      console.log("Datos recibidos:", req.body);

      const id_usuario = req.body.id_usuario;
      console.log("ID de usuario:", id_usuario);

      if (!id_usuario) {
        return res.status(400).json({
          success: false,
          message: "id_usuario es requerido",
        });
      }

      const params = { id_usuario };

      const CitasPorEmpleado = await EmpleadoServices.obtenerCitasPorIdUsuario(params);

      res.status(200).json({
        success: true,
        data: CitasPorEmpleado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }


}
