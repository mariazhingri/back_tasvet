const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const key = require('../../config/key');
const User = require('../../modelo/user_model'); 
require('dotenv').config();

module.exports = {
    async login(req, res) {
        try {
            const { email, clave } = req.body;
    
            // Busca al usuario en la base de datos
            const user = await User.findByUsername({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Error al obtener los datos'
                });
            }
    
            // Verifica la contraseña
            const isvalid = bcrypt.compareSync(clave, user.clave);
            if (!isvalid) {
                return res.status(401).json({
                    success: false,
                    message: 'Acceso no autorizado'
                });
            }
    
            // Genera el token JWT incluyendo id_usuario
            const token = jwt.sign({ 
                id_usuario: user.id_usuario,
                nombre: user.email,
                rol_descripcion: user.rol_descripcion
            }, key.JWT_SECRET, {});
            console.log('user', token);
    
            return res.status(200).json({
                message: "Login exitoso",
                user: email,
                token: `JWT ${token}`
            });
    
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los datos'
            });
        }
    },

    async register(req, res) {
    try {
        const { email, clave, persona } = req.body;
        const usuarioCreador = req.user?.id_usuario || 1;

        // Validar datos requeridos
        if (!email || !clave || !persona?.cedula) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos obligatorios (email, clave, cédula)'
            });
        }

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        const claveEncriptada = bcrypt.hashSync(clave, salt);

        // Validar si la cédula ya existe
        const cedulaExistente = await User.findByCedula(persona.cedula);
        let personaId;

        if (cedulaExistente) {
            // Si la cédula ya existe, reutilizar el id_persona
            personaId = cedulaExistente.id_persona;

            // Crear el usuario asociado a la persona existente
            const nuevoUsuario = await User.createUsuario({
                email,
                clave: claveEncriptada,
                persona_id: personaId, 
                estado: 'A', 
                reg_usuario: usuarioCreador
            });

            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: nuevoUsuario
            });
        } else {
            // Si la cédula no existe, crear un nuevo registro en personas y usuario
            const nuevaPersonawithusuario = await User.createPersonaYUsuario({
                email,
                clave: claveEncriptada,
                persona: {
                    cedula: persona.cedula,
                    nombre: persona.nombre,
                    apellido: persona.apellido,
                    telefono: persona.telefono,
                    estado: 'A', 
                    reg_usuario: usuarioCreador
                }
            });

            return res.status(201).json({
                success: true,
                message: 'Persona y usuario registrados exitosamente',
                data: nuevaPersonawithusuario
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario',
            error: err.message
        });
    }
},

    async updateUser(req, res) {
        try {
            const { id_usuario, rol_id, nombre, email, clave, telefono,estado } = req.body;
            const usuario_actualizador = req.user?.id_usuario; // Obtenemos el id_usuario del token
    
            // Verifica que exista el usuario actualizador
            if (!usuario_actualizador) {
                return res.status(401).json({
                    success: false,
                    message: 'No autorizado'
                });
            }
    
            // Prepare update data
            const datosActualizacion = {
                rol_id,
                nombre,
                email,
                telefono,
                estado
            };
    
            // If password is provided, hash it
            if (clave) {
                const salt = bcrypt.genSaltSync(10);
                const claveHash = bcrypt.hashSync(clave, salt);
                datosActualizacion.clave = clave;
                datosActualizacion.clave_segura = claveHash;
            }
    
            // Remove undefined values
            Object.keys(datosActualizacion).forEach(key => 
                datosActualizacion[key] === undefined && delete datosActualizacion[key]
            );
    
            // Update user
            const result = await User.updateUser(id_usuario, datosActualizacion, usuario_actualizador);
    
            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Usuario actualizado exitosamente'
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado o no se realizaron cambios'
                });
            }
    
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar el usuario',
                error: err.message 
            });
        }
    },

    async DeleteUser(req, res) {
        try {
            const { id_usuario } = req.body;
            const usuario_eliminador = req.user?.id_usuario; // ID del usuario que intenta eliminar
    
            // Verificar que existe el usuario autenticado
            if (!usuario_eliminador) {
                return res.status(401).json({
                    success: false,
                    message: 'No autorizado'
                });
            }
    
            // Verificar si el usuario a eliminar existe
            const userToDelete = await User.findByUsername({ id_usuario });
            if (!userToDelete) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
    
            // Verificar permisos
            if (usuario_eliminador !== 1) { // Si no es el usuario admin (id=1)
                if (usuario_eliminador !== id_usuario) { // Si no es su propio usuario
                    return res.status(403).json({
                        success: false,
                        message: 'Solo puede eliminar su propio usuario'
                    });
                }
            }
    
            // Perform soft delete
            const result = await User.deleteUser(id_usuario, usuario_eliminador);
    
            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Usuario eliminado exitosamente'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el usuario'
                });
            }
    
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al eliminar el usuario',
                //error: err.message
            });
        }
    }
};