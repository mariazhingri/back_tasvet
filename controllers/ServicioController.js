const Usuarios = require('../modelo/user_model');
const Servicio = require('../modelo/servicios_model'); 
require('dotenv').config();

module.exports = {
    async crearServicio(req, res) {

        const id_usuario = req.user?.id_usuario;

            // Verifica que exista el usuario actualizador
            if (!id_usuario) {
                return res.status(401).json({
                    success: false,
                    message: 'No autorizado'
                });
            }
    
        try {
             // Verifica el rol del usuario
            const userRol = await Usuarios.findRol(id_usuario);
            if (!userRol || userRol.rol_id !== 1 && userRol.rol_id !== 2) {
                return res.status(403).json({
                    success: false,
                    message: 'Acción no permitida'
                });
            }

            const { descripcion, categoria} = req.body;

            // Validar que todos los campos requeridos estén presentes
            if (!descripcion || !categoria ) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios'
                });
            }

            // Crear el servicio
            const nuevoServicio = await Servicio.crearServicio({
                descripcion,
                categoria,
                reg_usuario: id_usuario
            });

            return res.status(201).json({
                success: true,
                message: 'Servicio creado exitosamente',
                data: nuevoServicio
            });
        } catch (error) {
            console.error('Error al crear el servicio:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async obtenerServicios(req, res) {
       const id_usuario = req.user?.id_usuario; // ID del usuario autenticado

            // Validar si el usuario está autenticado
            if (!id_usuario) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }
    
        try {

            // Obtener los servicios
            const servicios = await Servicio.obtenerServicios();

            return res.status(200).json({
                success: true,
                data: servicios
            });
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}