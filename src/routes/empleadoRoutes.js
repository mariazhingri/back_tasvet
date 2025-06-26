const empleadoController = require("../controllers/empleadoController");
const verificarToken = require("../controllers/autenticacion/verificarToken");

module.exports = (app) => {
  app.post(
    "/api/empleado/obtener/citas",
    verificarToken,
    empleadoController.obtenerCitasPorEmpleados,
  );

  app.get(
    "/api/empleado/obtener/citas_veterinario",
    verificarToken,
    empleadoController.obtenerCitasPorUsuarioId,
  );
}