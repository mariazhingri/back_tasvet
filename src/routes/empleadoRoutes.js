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


  app.get(
    "/api/empleado/obtener/citas_veterinarioV2",
    verificarToken,
    empleadoController.obtenerCitasPorUsuarioIdV2,
  );


  app.get(
    "/api/empleado/obtener/citas_veterinario/rangoFecha",
    verificarToken,
    empleadoController.obtenerCitasPorRangoFechaIdUsuario,
  );

  // -----GRAFICAS -----
  app.get(
    "/api/empleado/obtener/citas/atendidas/mes/:anio",
    verificarToken,
    empleadoController.obtenerTotalCitasAtendidasPorMes,
  );

}
