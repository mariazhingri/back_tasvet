const CitaController = require("../controllers/citaController");
const verificarToken = require("../controllers/autenticacion/verificarToken");

module.exports = (app) => {
  app.get("/api/cita/obtener", verificarToken, CitaController.obtenerCitas);
  //app.get('/api/cita/obtener/formularios', verificarToken, CitaController.listarFormularios);

  app.post("/api/cita/crear", verificarToken, CitaController.crearCita);
  app.post(
    "/api/cita/obtener/fecha",
    verificarToken,
    CitaController.obtenerCitasPorFecha,
  );
  app.post(
    "/api/cita/obtener/porId",
    verificarToken,
    CitaController.obtenerCitasPorId,
  );
  app.post(
    "/api/cita/obtener/rangoMes",
    verificarToken,
    CitaController.obtenerCitaPorRangoMes,
  );
};
