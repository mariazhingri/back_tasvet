const {
  obtenerCitas,
  getCitasRetrasadas,
  getCitasCanceladas,
  getCitasByDate,
  getCitasByIdCita,
  getCitasByRangoMes,
} = require('../modelo/cita_model');
const CitaService = require('../services/citaService');
const { listarFormularios } = require('../services/servicioService');

module.exports = {
  async obtenerCitas(req, res) {
    try {
      //id_usuario = req.user?.id_usuario;

      const citas = await CitaService.obtenerCitas();

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
      id_usuario = req.user?.id_usuario;

      const citas = await getCitasRetrasadas(id_usuario);

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
      id_usuario = req.user?.id_usuario;

      const citas = await getCitasCanceladas(id_usuario);

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

  async obtenerCitasPorFecha(req, res) {
    console.log(':_) Obteniendo citas por fecha');
    try {
      const { fecha } = req.body;
      console.log('Fecha recibida:', fecha);

      if (!fecha) {
        return res.status(400).json({
          success: false,
          message: 'Fecha no proporcionada',
        });
      }

      const citas = await getCitasByDate(fecha);

      res.status(200).json({
        success: true,
        data: citas,
        message: 'Citas obtenidas correctamente',
      });

      console.log('Citas obtenidas:', citas);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerCitasPorId(req, res) {
    console.log(') Obteniendo citas por id');
    try {
      const { idCita } = req.body;
      console.log('Id de cita recibida:', idCita);

      if (!idCita) {
        return res.status(400).json({
          success: false,
          message: 'Id de la cita no proporcionada',
        });
      }

      const cita = await getCitasByIdCita(idCita);

      res.status(200).json({
        success: true,
        data: cita,
        message: 'Cita obtenidas correctamente',
      });

      // console.log('Cita obtenida:', cita)
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerCitaPorRangoMes(req, res) {
    console.log(' Obteniendo citas rango de un mes ');
    try {
      const { inicioMes } = req.body;
      const { finMes } = req.body;

      console.log('Rango recibido', inicioMes, finMes);

      if (!inicioMes || !finMes) {
        return res.status(400).json({
          success: false,
          message: 'Rango de mes no esta definido',
        });
      }

      const rangoCita = await getCitasByRangoMes(inicioMes, finMes);

      res.status(200).json({
        success: true,
        data: rangoCita,
        message: 'Rango de Cita por mes obtenidas correctamente',
      });

      // console.log('Cita obtenida:', cita)
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async crearCita(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      body = req.body;
      const params = {
        ...body,
        reg_usuario: usuario_creador,
      };
      const result = await CitaService.crearCita(params);
      return res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
