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

  async obtenerCitasPorUsuarioId(req, res) {
    console.log("Iniciando obtenerCitasPorUsuarioId");
    try {
      const id_usuario = req.user?.id_usuario;
      console.log("ID de usuario recibido:", id_usuario);
      const CitasPorEmpleado = await EmpleadoServices.obtenerCitasPorUsuarioId(id_usuario);

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


  async obtenerCitasPorUsuarioIdV2(req, res) {
    console.log("Iniciando obtenerCitasPorUsuarioId");
    try {
      const id_usuario = req.user?.id_usuario;
      console.log("ID de usuario recibido:", id_usuario);
      const CitasPorEmpleado = await EmpleadoServices.obtenerCitasPorUsuarioIdV2(id_usuario);

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


  async obtenerCitasPorRangoFechaIdUsuario(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { inicioMes, finMes } = req.query;

      if (!inicioMes || !finMes) {
        return res.status(400).json({ success: false, message: "Faltan parámetros de fecha" });
      }

      // Convertir strings a Date
      const fechaInicio = new Date(inicioMes);
      const fechaFin = new Date(finMes);

      const citas = await EmpleadoServices.obtenerCitasPorRangoFecha(id_usuario, fechaInicio, fechaFin);

      res.status(200).json({ success: true, data: citas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }

}
