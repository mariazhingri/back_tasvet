const veterinarioController = require('../controllers/veterinarioController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
    app.get('/veterinario/mascotas-agendadas', verificarToken, veterinarioController.MascotasAgendadas);
    app.get('/veterinario/atencion-veterinaria/:id_mascota', verificarToken, veterinarioController.atencionVeterinaria);
    app.post('/veterinario/crear', verificarToken, veterinarioController.CrearVeterinario);
}