const ServicioController = require('../controllers/ServicioController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
  app.get('/servicio/obtener', verificarToken, ServicioController.obtenerServicios);
  app.get('/servicio/obtener/formularios', verificarToken, ServicioController.obtenerFormularios);

  app.post('/servicio/crear', verificarToken, ServicioController.crearServicio);
  app.put('/servicio/actualizar', verificarToken, ServicioController.actualizarServicio);

  // Ruta para cambiar estado del servicio :)
  app.put(
    '/servicio/estado/disponible',
    verificarToken,
    ServicioController.cambiarEstadoDisponible,
  );
  app.put(
    '/servicio/estado/noDisponible',
    verificarToken,
    ServicioController.cambiarEstadoNoDisponible,
  );
  /*Rutas para agregar y eliminar un servico a una cita agendada*/
  app.delete(
    "/api/servicio/eliminar/:IdCita/:IdServicio",
    verificarToken,
    ServicioController.eliminarServicioDeCita,
  );

  app.post(
    "/api/servicio/agregar",
    verificarToken,
    ServicioController.agregarServicioaCita,
  );

  // Rutas para la versión 2 de los servicios :)
  app.post('/servicio/crearV2', verificarToken, ServicioController.crearServicioV2);
  app.put('/servicio/eliminarV2', verificarToken, ServicioController.eliminarServicioV2);

  //------GRAFICAS ------
  app.get('/servicio/graficas/masSolicitados/:anio', verificarToken, ServicioController.obtenerServiciosMasSolicitados);

  //para INSUMOS 
  app.post(
    "/api/insumos/vacuna/agregar",
    verificarToken,
    ServicioController.agregarVacuna,
  );
  app.get('/insumos/vacunas/obtener', verificarToken, ServicioController.obtenerVacunas);

  app.post(
    "/api/insumos/vacuna/actualizar",
    verificarToken,
    ServicioController.actualizarVacuna,
  );


  app.put(
    "/api/insumos/delete/vacuna",
    verificarToken,
    ServicioController.eliminarVacuna,
  );

  //antiparasitarios
  app.post(
    "/api/insumos/antiparasitario/agregar",
    verificarToken,
    ServicioController.agregarAntiparasitario,
  );
  app.get('/insumos/antiparasitario/obtener', verificarToken, ServicioController.obtenerAntiparasitarios);

  app.post(
    "/api/insumos/antiparasitario/actualizar",
    verificarToken,
    ServicioController.actualizarAntiparasitario,
  );

  app.put(
    "/api/insumos/delete/antiparasitario",
    verificarToken,
    ServicioController.eliminarAntiparasitario,
  );


};
