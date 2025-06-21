const formularioController = require('../controllers/fomrulariosController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

    app.get('/api/obtener/empleados', verificarToken,formularioController.obtenerEmpleados);
    app.get('/api/obtener/vacunas', verificarToken,formularioController.obtenerVacunas);
    
    app.post('/api/carnet/vacuna/crear', verificarToken,formularioController.crearCarnetVacuna);
    app.post('/api/carnet/desparasitacion/crear', verificarToken,formularioController.crearCarnetDesparasitacion);
    app.post('/api/carnet/atencion_veterinaria/crear', verificarToken,formularioController.crearAtencionVeterinaria);
    app.post('/api/carnet/spa/crear', verificarToken,formularioController.crearCarnetSpa);

}