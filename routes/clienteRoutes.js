const clienteController = require('../controllers/clienteController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
    
    app.get('/api/obtener/cliente', verificarToken,clienteController.obtenerDatosCliente);
    app.post('/api/create/cliente', verificarToken,clienteController.crearCliente);

}