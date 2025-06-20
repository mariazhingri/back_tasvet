const HistorialClinicoController = require('../controllers/historialClinicoController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
  app.get('/historialClinico/obtener/atencionVeterinaria/:id', verificarToken, HistorialClinicoController.obtenerAtencionVeterinariaPorId);
}
