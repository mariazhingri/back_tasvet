const mascotaController = require('../controllers/mascotaController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

  app.get('/mascota/obtener', verificarToken, mascotaController.ObtenerMascota);
  app.get('/mascota/obtener/razas', verificarToken, mascotaController.obtenerRazas);
  app.get('/mascota/obtener/mascotas_de_cliente/:id_cliente', verificarToken, mascotaController.obtenerMascotaDeCliente);
  app.post('/mascota/obtener/mascota_by_id', verificarToken, mascotaController.obtenerMascotaPorId);


  app.post('/mascota/asignar_nueva_mascota', verificarToken, mascotaController.asignarNuevaMascota);

  app.put('/mascota/actualizar', verificarToken, mascotaController.actualizarMascota);
  app.put('/api/mascota/eliminar', verificarToken, mascotaController.eliminarMascota);

  //app.delete('/mascota/eliminar/:mascota_id', verificarToken ,mascotaController.deletemascota);

}
