const Clientes = require('../modelo/cliente_model'); 
require('dotenv').config();

module.exports = {

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
// }async register(req, res) {
//         try {
//             const {email, clave, nombre, apellido, cedula, telefono, direccion  } = req.body;

//             // Validar campos requeridos
//             if (!email || !clave || !nombre || !apellido || !cedula || !telefono || !direccion ) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Todos los campos son requeridos'
//                 });
//             }

//             // Verificar si el email ya existe
//             const existingUser = await User.findByUsername({ email });
//             if (existingUser) {
//                 return res.status(410).json({
//                     success: false,
//                     message: 'El correo electrónico ya está registrado'
//                 });
//             }
    
//             // Generar hash de la contraseña
//             const salt = bcrypt.genSaltSync(10);
//             const claveHash = bcrypt.hashSync(clave, salt);
    
//             // Crear nuevo usuario
//             const result = await User.createUserWithPerson(
//                 email,
//                 claveHash,
//                 nombre,
//                 apellido,
//                 cedula,
//                 telefono,
//                 direccion
//             );
//             //console.log('Resultado de createUserWithPerson:', result);
//             if (result) {
//                 return res.status(201).json({
//                     success: true,
//                     message: 'Usuario registrado exitosamente'
//                 });
//             } else {
//                 throw new Error('No se pudo crear el usuario');
//             }
    
//         } catch (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'Error en el servidor al registrar usuario',
//                 error: err.message
//             });
//         }
//     },