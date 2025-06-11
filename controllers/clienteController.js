require('dotenv').config();
const clienteService = require('../services/clienteService')
const Clientes = require('../modelo/cliente_model')

module.exports = {

    async obtenerDatosUsuario(req, res) {
        try {
            const id_usuario = req.user?.id_usuario; 

            // Validar si el usuario está autenticado
            if (!id_usuario) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const params = { id_usuario };
            const usuario = await Clientes.datosUsuario(params);

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: usuario
            });
        } catch (error) {
            console.error(error); // Registrar el error en el servidor
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    async obtenerDatoClientes(req, res) {
        try {
            const id_usuario = req.user?.id_usuario; 
            const cliente = await clienteService.getClients(id_usuario)

            res.status(200).json({
                success: true,
                data: cliente
            });
        } catch (error) {
            //console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    },

    async CreateclientePetController(req, res) {
        try {
            const usuario_creador = req.user?.id_usuario;
            const clienteCreado = await clienteService.createClientPet(req.body, usuario_creador); 

            res.status(201).json({
                success: true,
                message: 'Cliente creado exitosamente',
                data: clienteCreado 
            });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async UpdateClient(req, res) {
        try {
            const usuario_actualizador = req.user?.id_usuario; 
            const clienteActualizado = await clienteService.updateClient(req.body, usuario_actualizador);

            res.status(200).json({
                success: true,
                message: 'Cliente actualizado exitosamente',
                data: clienteActualizado
            });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async DeleteClient(req, res) {
        try {
            const usuario_eliminador = req.user?.id_usuario; 
            const { id_cliente } = req.body
            const clienteEliminado = await clienteService.deleteClient(id_cliente, usuario_eliminador);

            res.status(200).json({
                success: true,
                message: 'Cliente eliminado exitosamente',
                //data: clienteEliminado
            });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },
}