const Clientes = require('../modelo/cliente_model'); 
require('dotenv').config();

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

            // Validar si el usuario está autenticado
            if (!id_usuario) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const params = { id_usuario };
            const cliente = await Clientes.datosCliente(params);

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

    async CreateclientePetController(req, res) {
    try {
        const { id_usuario } = req.body;
        const usuario_creador = req.user?.id_usuario; 

        const {
                nombre,
                apellido,
                cedula,
                telefono_1,
                telefono_2,
                correo,
                direccion,
                nombre_mascota,
                especie,
                raza_id,
                fecha_nacimiento,
                sexo,
                peso_kg
            } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !cedula || !telefono_1 || !correo || !direccion) {
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

        // Verificar permisos
        if (usuario_creador !== 1 && usuario_creador!==2) { // Si no es el usuario admin (id=1)
            if (usuario_creador !== id_usuario) { // Si no es su propio usuario
                return res.status(403).json({
                    success: false,
                    message: 'Solo puede eliminar su propio usuario'
                });
            }
        }

        const params = {
                nombre,
                apellido,
                cedula,
                telefono_1,
                telefono_2,
                correo,
                direccion,
                nombre_mascota,
                especie,
                raza_id,
                fecha_nacimiento,
                sexo,
                peso_kg,
                reg_usuario: usuario_creador
            };
        // Crear cliente
        const clienteCreado = await Clientes.createClientPet(params);

        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: params 
        });
    } catch (error) {
        console.error(error); // Registrar el error en el servidor
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
    },

    async UpdateClient(req, res) {
        try {
            const { id_usuario } = req.body;
            const usuario_creador = req.user?.id_usuario; 


            // Verificar permisos
            if (usuario_creador !== 1 && usuario_creador !== 2) { 
                return res.status(403).json({
                    success: false,
                    message: 'No tiene permisos para actualizar este cliente'
                });
                
            }

            const {
                id_persona,
                id_cliente,
                nombre,
                apellido,
                cedula,
                telefono_1,
                telefono_2,
                correo,
                direccion
            } = req.body;

            const params = {
                id_persona,
                id_cliente,
                nombre,
                apellido,
                cedula,
                telefono_1,
                telefono_2,
                correo,
                direccion,
                reg_usuario: usuario_creador
            };
            const clienteActualizado = await Clientes.updateClient(params);

            res.status(200).json({
                success: true,
                message: 'Cliente actualizado exitosamente',
                data: clienteActualizado
            });
        } catch (error) {
            console.error(error); // Registrar el error en el servidor
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },
}