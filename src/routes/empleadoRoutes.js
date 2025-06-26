const empleadoController = require("../controllers/empleadoController");
const verificarToken = require("../controllers/autenticacion/verificarToken");

module.exports = (app) => {
  app.post(
    "/api/empleado/obtener/citas",
    verificarToken,
    empleadoController.obtenerCitasPorEmpleados,
  );

  app.post(
    "/api/empleado/obtener/citas/idUsuario",
    verificarToken,
    empleadoController.obtenerCitasPorEmpleados,
  );

}
