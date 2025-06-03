const usersController = require('../controllers/autenticacion/authController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

    app.post('/api/users/login', usersController.login);
    app.post('/api/users/registro', usersController.register);
    app.post('/verificacion/correo', usersController.solicitarCodigo);
    app.post('/verificacion/codigo', usersController.verificarCodigo);

    app.put('/api/users/actualizar',  usersController.updateUserController);

    app.get('/api/users/obtener_cedula/:cedula', usersController.VerificarCedula);

    app.delete('/api/users/eliminar', verificarToken ,usersController.DeleteUser);

}