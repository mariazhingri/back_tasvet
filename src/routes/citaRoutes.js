const CitaController = require('../controllers/citaController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
  app.get('/api/cita/obtener/pendientes', verificarToken, CitaController.obtenerCitas);
  app.get('/api/cita/obtener/retrasadas', verificarToken, CitaController.obtenerCitasRetrasadas);
  app.get('/api/cita/obtener/canceladas', verificarToken, CitaController.obtenerCitasCanceladas);

  //app.get('/api/cita/obtener/formularios', verificarToken, CitaController.listarFormularios);

  app.post('/api/cita/crear', verificarToken, CitaController.crearCita);
  app.post('/api/cita/cancelar', verificarToken, CitaController.cancelarCita);

  app.post('/api/cita/obtener/fecha', verificarToken, CitaController.obtenerCitasPorFecha);
  app.post('/api/cita/obtener/porId', verificarToken, CitaController.obtenerCitasPorId);
  app.post('/api/cita/obtener/rangoMes', verificarToken, CitaController.obtenerCitaPorRangoMes);
  // app.post('/api/cita/obtener/rangoIdEmpleado', verificarToken, CitaController.obtenerCitaPorRangoIdEmpleado);

};
