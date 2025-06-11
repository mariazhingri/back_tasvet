const mascotaController = require('../controllers/mascotaController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {

    app.get('/mascota/obtener', verificarToken ,mascotaController.ObtenerMascota);
    app.get('/mascota/obtener/razas', verificarToken ,mascotaController.getRazas);

    app.get('/mascota/obtener/mascotas_de_cliente/:id_cliente', verificarToken ,mascotaController.obtenerMascotaDeCliente);
    app.post('/mascota/crear', verificarToken ,mascotaController.crearmascota);
    app.post('/mascota/asignar_nueva_mascota', verificarToken ,mascotaController.asignarNuevaMascota);
    
    app.put('/mascota/actualizar', verificarToken ,mascotaController.updatemascota);
    app.put('/mascota/eliminar', verificarToken ,mascotaController.deleteMascota);

    //app.delete('/mascota/eliminar/:mascota_id', verificarToken ,mascotaController.deletemascota);

}