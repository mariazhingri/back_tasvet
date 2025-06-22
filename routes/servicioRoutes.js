const ServicioController = require('../controllers/ServicioController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
  app.get('/servicio/obtener', verificarToken, ServicioController.obtenerServicios);
  app.get('/servicio/obtener/formularios', verificarToken, ServicioController.obtenerFormularios);

  app.post('/servicio/crear', verificarToken, ServicioController.crearServicio);
  app.put('/servicio/actualizar', verificarToken, ServicioController.actualizarServicio);
  app.put('/servicio/eliminar', verificarToken, ServicioController.eliminarServicio);

  // Rutas para la versión 2 de los servicios
  app.post('/servicio/crearV2', verificarToken, ServicioController.crearServicioV2);
  app.put('/servicio/eliminarV2', verificarToken, ServicioController.eliminarServicioV2);
};
