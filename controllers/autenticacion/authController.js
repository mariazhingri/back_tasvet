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
            const isvalid = bcrypt.compareSync(clave, user.clave_segura);
            if (!isvalid) {
                return res.status(401).json({
                    success: false,
                    message: 'Acceso no autorizado'
                });
            }
    
            // Genera el token JWT incluyendo id_usuario
            const token = jwt.sign({ 
                user: email,
                id_usuario: user.id_usuario 
            }, key.JWT_SECRET, {});
    
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
            const { rol_id, nombre, email, clave, telefono,estado, reg_fecha } = req.body;
    
            // Verificar si el usuario ya existe
            const existingUser = await User.findByUsername({ email });
            //console.log('Usuario existente:', existingUser); // Debug log
    
            if (existingUser && existingUser.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario ya existe'
                });
            }
    
            // Generar hash de la contraseña
            const salt = bcrypt.genSaltSync(10);
            const claveHash = bcrypt.hashSync(clave, salt);
    
            // Crear nuevo usuario
            const result = await User.createUser(rol_id,nombre,email, clave, claveHash, telefono,estado,reg_fecha);
    
            if (result && result.affectedRows === 1) {
                return res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente'
                });
            } else {
                throw new Error('No se pudo crear el usuario');
            }
    
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor',
                //error: err.message
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