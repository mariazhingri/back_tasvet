const ServicioController = require("../controllers/ServicioController");
const verificarToken = require("../controllers/autenticacion/verificarToken");

module.exports = (app) => {
  app.get(
    "/servicio/obtener",
    verificarToken,
    ServicioController.obtenerServicios,
  );
  app.get(
    "/servicio/obtener/formularios",
    verificarToken,
    ServicioController.obtenerFormularios,
  );

  app.post("/servicio/crear", verificarToken, ServicioController.crearServicio);
  app.put(
    "/servicio/actualizar",
    verificarToken,
    ServicioController.actualizarServicio,
  );
  app.put(
    "/servicio/eliminar",
    verificarToken,
    ServicioController.eliminarServicio,
  );

  app.post(
    "/servicio/crearV2",
    verificarToken,
    ServicioController.crearServicio,
  );
};
