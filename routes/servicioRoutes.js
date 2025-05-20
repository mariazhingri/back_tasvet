const ServicioController = require('../controllers/ServicioController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

    app.get('/servicio/obtener', verificarToken ,ServicioController.obtenerServicios);
    app.post('/servicio/crear', verificarToken ,ServicioController.crearServicio);

}