const mascotaController = require('../controllers/mascotaController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

  app.post('/mascota/crear', verificarToken, mascotaController.crearmascota);
  app.put('/mascota/actualizar/:mascota_id', verificarToken, mascotaController.updatemascota);
  app.get('/mascota/cliente/:cliente_id', verificarToken, mascotaController.getMascotaByClienteId);

}
