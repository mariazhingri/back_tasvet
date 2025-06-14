const clienteController = require('../controllers/clienteController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

  app.get('/api/obtener/cliente', verificarToken, clienteController.obtenerDatosCliente);
  app.get('/api/obtener/clienteV2', verificarToken, clienteController.obtenerDatosClienteV2);
  app.post('/api/create/cliente', verificarToken, clienteController.crearCliente);

}
