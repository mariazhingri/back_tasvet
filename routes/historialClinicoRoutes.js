const HistorialClinicoController = require('../controllers/historialClinicoController');
const verificarToken = require('../controllers/autenticacion/verificarToken');

module.exports = (app) => {
  app.get(
    '/historialClinico/obtener/atencionVeterinaria/:id',
    verificarToken,
    HistorialClinicoController.obtenerAtencionVeterinariaPorId,
  );
  app.get(
    '/historialClinico/obtener/vacunacion/:id',
    verificarToken,
    HistorialClinicoController.obtenerVacunacionPorId,
  );
  app.get(
    '/historialClinico/obtener/desparacitacion/:id',
    verificarToken,
    HistorialClinicoController.obtenerDesparacitacionPorId,
  );
  app.get(
    '/historialClinico/obtener/spa/:id',
    verificarToken,
    HistorialClinicoController.obtenerSpaPorId,
  );
};
