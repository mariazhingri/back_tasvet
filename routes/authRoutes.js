const usersController = require('../controllers/autenticacion/authController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

    app.post('/api/users/login', usersController.login);
    app.post('/api/users/registro', usersController.register);
    app.post('/api/users/actualizar', verificarToken ,usersController.updateUser);
    app.post('/api/users/eliminar', verificarToken ,usersController.DeleteUser);

}