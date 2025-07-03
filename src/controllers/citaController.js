const {
  obtenerCitas,
  getCitasRetrasadas,
  getCitasCanceladas,
  getCitasByDate,
  getCitasByIdCita,
  getCitasByRangoMes,
} = require('../modelo/cita_model');
const citaService = require('../services/citaService');
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
      console.log('Obteniendo citas retrasadas');
      id_usuario = req.user?.id_usuario;

      // const citas = await getCitasRetrasadas(id_usuario);

      const citas = await CitaService.obtenerCitasRetrasadas();

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

      // const citas = await getCitasCanceladas(id_usuario);
      const citas = await CitaService.obtenerCitasCanceladas();

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

      // const cita = await getCitasByIdCita(idCita);
      const cita = await CitaService.obtenerCitasPorIdCita(idCita);
      console.log('Cita obtenida por id_cita:', cita);


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

  async obtenerCitaPorRangoIdEmpleado(req, res) {
    try {
      const { fechaInicio } = req.body;
      const { fechaFin } = req.body;
      const { idEmpleado } = req.body;

      if (!fechaInicio || !fechaFin || !idEmpleado) {
        return res.status(400).json({
          success: false,
          message: 'Rango de mes no esta definido',
        });
      }

      const rangoCita = await citaService.obtenerCitasPorFechaIdEmpleado(fechaInicio, fechaFin, idEmpleado);

      res.status(200).json({
        success: true,
        data: rangoCita,
        message: 'Rango de Cita obtenidas correctamente por id empleado',
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

  async cancelarCita(req, res) {
    console.log('Cancelando cita...');
    const { id_usuario, rol_descripcion } = req.user;
    const { id_cita, motivo } = req.body;
    console.log('Datos recibidos:', { id_usuario, rol_descripcion, id_cita, motivo });

    if (!['Administrador', 'Auxiliar'].includes(rol_descripcion)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para cancelar citas',
      })
    }

    if (!id_cita || !motivo) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos para cancelar la cita',
      });
    }

    try {
      const result = await CitaService.cancelarCitas(id_cita, motivo, id_usuario);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cita no encontrada o ya cancelada',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Cita cancelada correctamente',
      });


    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      }
      );
    }
  }
};

