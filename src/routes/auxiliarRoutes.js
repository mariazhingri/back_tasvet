const auxiliarController = require("../controllers/auxiliarController");
const verificarToken = require("../controllers/autenticacion/verificarToken");

module.exports = (app) => {
  app.get('/api/auxiliar/obtener/citas', verificarToken, auxiliarController.obtenerCitasAuxiliar);
}
