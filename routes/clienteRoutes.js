const clienteController = require("../controllers/clienteController");
const verificarToken = require("../controllers/autenticacion/verificarToken");

module.exports = (app) => {
  app.get(
    "/api/obtener/usuario",
    verificarToken,
    clienteController.obtenerDatosUsuario,
  );
  app.get(
    "/api/obtener/cliente",
    verificarToken,
    clienteController.obtenerDatoClientes,
  );

  app.post(
    "/api/create/cliente",
    verificarToken,
    clienteController.crearMascotayCliente,
  );

  //app.put('/api/cliente/actualizar', verificarToken,clienteController.actualizarCliente);
  app.put(
    "/api/delete/cliente",
    verificarToken,
    clienteController.eliminarCliente,
  );

  //app.post('/api/crear/cliente', verificarToken,clienteController.crearCliente);
  //app.post('/mascota/crearycliente', verificarToken ,mascotaController.crearMascotayCliente);

  //app.get('/api/obtener/cliente', verificarToken, clienteController.obtenerDatosCliente);
  //app.get('/api/obtener/clienteV2', verificarToken, clienteController.obtenerDatosClienteV2);
  app.post(
    "/api/create/cliente",
    verificarToken,
    clienteController.crearCliente,
  );
};
