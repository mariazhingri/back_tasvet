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

  // -----------CONSULTA de citas solo para el veterinario-------------------
  app.get('/api/veterinario/obtener/pendientes', verificarToken, empleadoController.obtenerCitas);
  app.get('/api/veterinario/obtener/retrasadas', verificarToken, empleadoController.obtenerCitasRetrasadas);
  app.get('/api/veterinario/obtener/canceladas', verificarToken, empleadoController.obtenerCitasCanceladas);
  app.get('/api/veterinario/obtener/atendidas', verificarToken, empleadoController.obtenerCitasAtendidas);

    // -----------CONSULTA solo para el admin-------------------
  app.get('/api/veterinario/obtener/empleados', verificarToken, empleadoController.obtenerEmpleados);
  app.get('/api/veterinario/obtener/cargo_empleados', verificarToken, empleadoController.obtenerCargoDeEmpleados);

}
