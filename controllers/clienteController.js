const Clientes = require('../modelo/cliente_model');
require('dotenv').config();

module.exports = {

  async obtenerDatosClienteV2(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const id_usuario = decoded.id_usuario;

      if (!id_usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const cliente = await Clientes.datosCliente({ id_usuario });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: cliente
      });
    } catch (error) {
      console.error('❌ Error en obtenerDatosCliente2:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  async obtenerDatosCliente(req, res) {
    try {
      const id_usuario = req.user?.id_usuario; // ID del usuario autenticado

      // Validar si el usuario está autenticado
      if (!id_usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const params = { id_usuario };
      const cliente = await Clientes.datosCliente(params);

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: cliente
      });
    } catch (error) {
      console.error(error); // Registrar el error en el servidor
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },


  async crearCliente(req, res) {
    try {
      const { nombre, apellido, cedula, telefono, email, direccion } = req.body;

      // Validar campos requeridos
      if (!nombre || !apellido || !cedula || !telefono || !email || !direccion) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos'
        });
      }

      // Validar usuario autenticado
      if (!req.user || !req.user.id_usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const params = {
        nombre,
        apellido,
        cedula,
        telefono,
        email,
        direccion,
        reg_usuario: req.user.id_usuario
      };

      // Crear cliente
      const clienteCreado = await Clientes.createCliente(params);

      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: clienteCreado // Opcional: devolver datos del cliente creado
      });
    } catch (error) {
      console.error(error); // Registrar el error en el servidor
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
