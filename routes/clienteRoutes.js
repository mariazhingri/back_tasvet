const clienteController = require('../controllers/clienteController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
    
    app.get('/api/obtener/usuario', verificarToken,clienteController.obtenerDatosUsuario);
    app.get('/api/obtener/cliente', verificarToken,clienteController.obtenerDatoClientes);

    app.post('/api/create/cliente', verificarToken,clienteController.CreateclientePetController);

    app.put('/api/update/cliente', verificarToken,clienteController.UpdateClient);
    app.put('/api/delete/cliente', verificarToken,clienteController.DeleteClient)

}