require("dotenv").config();
const clienteService = require("../services/clienteService");
const ClienteModel = require("../modelo/cliente_model");

module.exports = {
  async obtenerDatosUsuario(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;

      // Validar si el usuario está autenticado
      if (!id_usuario) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const params = { id_usuario };
      const usuario = await ClienteModel.obtenerDatosUsuario(params);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      console.error(error); // Registrar el error en el servidor
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  async obtenerDatoClientes(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const cliente = await clienteService.obtenerDatosClientes(id_usuario);

      res.status(200).json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      //console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  async crearMascotayCliente(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;
      const params = {
        ...body,
        reg_usuario: usuario_creador,
      };
      const clienteCreado = await clienteService.crearMascotayCliente(params);

      res.status(201).json({
        success: true,
        message: "Cliente creado exitosamente",
        data: clienteCreado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async eliminarCliente(req, res) {
    try {
      const usuario_eliminador = req.user?.id_usuario;
      const { id_cliente } = req.body;
      const clienteEliminado = await clienteService.eliminarCliente(
        id_cliente,
        usuario_eliminador,
      );

      res.status(200).json({
        success: true,
        message: "Cliente eliminado exitosamente",
        //data: clienteEliminado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async crearCliente(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const { persona_id, direccion } = req.body; // ojo, te faltaba direccion también

      const params = {
        persona_id: persona_id,
        direccion: direccion,
        reg_usuario: usuario_creador,
      };

      const clienteId = await ClienteModel.crearCliente(params);

      res.status(200).json({
        success: true,
        message: "Cliente creado exitosamente",
        data: clienteId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async actualizarCliente(req, res) {
    try {
      const usuario_actualizador = req.user?.id_usuario;
      const body = req.body;
      const params = {
        ...body,
        act_usuario: usuario_actualizador,
      };
      const clienteActualizado = await clienteService.actualizarCliente(params);

      res.status(200).json({
        success: true,
        message: "Cliente actualizado exitosamente",
        data: clienteActualizado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async obtenerDatosClienteV2(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token no proporcionado",
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const id_usuario = decoded.id_usuario;

      if (!id_usuario) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const cliente = await ClienteModel.obtenerDatosCliente({ id_usuario });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: "Cliente no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      console.error("❌ Error en obtenerDatosCliente2:", error.message);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },
};
