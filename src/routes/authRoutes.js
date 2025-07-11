const usersController = require("../controllers/autenticacion/authController");
const verificarToken = require("../controllers/autenticacion/verificarToken");

module.exports = (app) => {
  app.post("/api/users/login", usersController.login);
  app.post("/api/users/registro", usersController.register);
  app.post("/verificacion/correo", usersController.solicitarCodigo);
  app.post("/verificacion/codigo", usersController.verificarCodigo);
  app.post("/api/users/registrar_admin", usersController.registerAdmin);
  app.post("/api/users/registrar/auxiliar", usersController.registerAuxiliar);
  app.post("/api/users/registrar/veterinario", usersController.registerVeterinario);

  app.post("/api/users/cambia_Clave", usersController.cambiarClave)

  app.put("/api/users/actualizar", usersController.updateUserController);

  app.get("/api/users/obtener_cedula/:cedula", usersController.VerificarCedula);

  app.delete("/api/users/eliminar", verificarToken, usersController.DeleteUser);

  app.post("/api/users/verificarCorreo_SolicitarCodigo", usersController.verificarCorreoYSolicitarCodigo)
};
