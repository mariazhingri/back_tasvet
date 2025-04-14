const usersController = require('../controllers/autenticacion/authController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

    app.post('/api/users/login', usersController.login);
    app.post('/api/users/registro', usersController.register);

}