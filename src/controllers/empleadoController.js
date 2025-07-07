const EmpleadoServices = require("../services/empleadoServices");
const EmpleadoModel = require("../modelo/empleado_model");
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
  },
  //-------GRAFICAS --------
  async obtenerTotalCitasAtendidasPorMes(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { anio } = req.params;
      const Empleados = await EmpleadoServices.obtenerTotalCitasAtendidasPorMes(anio);
      return res.status(200).json({
        success: true,
        data: Empleados,
      });
    } catch (error) {
      console.error('Error al obtener los Empleados más solicitados:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  //----------SOLO PARA VETERINARIOS----------------

  async obtenerCitas(req, res) {
    try {
      id_usuario = req.user?.id_usuario;

      console.log('Obteniendo citas para el veterinario', id_usuario);
      const citas = await EmpleadoServices.obtenerCitas(id_usuario);

      res.status(200).json({
        success: true,
        data: citas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerCitasRetrasadas(req, res) {
    try {
      console.log('Obteniendo citas retrasadas');
      id_usuario = req.user?.id_usuario;

      const citas = await EmpleadoServices.obtenerCitasRetrasadasVet(id_usuario);

      res.status(200).json({
        success: true,
        data: citas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerCitasCanceladas(req, res) {
    try {
      let id_usuario = req.user?.id_usuario;

      // const citas = await getCitasCanceladas(id_usuario);
      const citas = await EmpleadoServices.obtenerCitasCanceladasVet(id_usuario);

      res.status(200).json({
        success: true,
        data: citas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerCitasAtendidas(req, res) {
    try {
      let id_usuario = req.user?.id_usuario;

      // const citas = await getCitasCanceladas(id_usuario);
      const citas = await EmpleadoServices.obtenerCitasAtendidaVet(id_usuario);

      res.status(200).json({
        success: true,
        data: citas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },


}
