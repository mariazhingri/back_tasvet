const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const key = require('../../config/key');
const User = require('../../modelo/user_model'); 
const { enviarCodigoVerificacion } = require('../../services/mailSend');
const {guardarCodigo}  = require('../../modelo/CodigoVerificacionModel');
const { verificarCodigoDB } = require('../../modelo/CodigoVerificacionModel');
require('dotenv').config();

module.exports = {
    async login(req, res) {
        try {
            const { correo, clave } = req.body;
    
            // Busca al usuario en la base de datos
            const user = await User.findUsuario({ correo });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Error al obtener los datos',
                    error: err.message 
                });
            }
    
            /// Verifica la contraseña
            let isvalid;

            // Verifica si la contraseña almacenada parece estar encriptada
            if (user.clave.startsWith('$2b$') || user.clave.startsWith('$2a$')) {
                // Si está encriptada, usa bcrypt para comparar
                isvalid = bcrypt.compareSync(clave, user.clave);
            } else {
                // Si no está encriptada, compara directamente (texto plano)
                isvalid = clave === user.clave;
            }

            if (!isvalid) {
                return res.status(401).json({
                    success: false,
                    message: 'Acceso no autorizado'
                });
            }
    
            // Genera el token JWT incluyendo id_usuario
            const token = jwt.sign({ 
                id_usuario: user.id_usuario,
                nombre: user.correo,
                rol_descripcion: user.rol_descripcion
            }, key.JWT_SECRET, {});
            //console.log('user', token);
    
            return res.status(200).json({
                message: "Login exitoso",
                user: correo,
                token: `JWT ${token}`
            });
    
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los datoss',
                error: err.message 
            });
        }
    },

    async register(req, res) {
    try {
        const { clave, persona } = req.body;
        const usuarioCreador = req.user?.id_usuario || 1;

        // Validar datos requeridos
        if ( !clave || !persona?.cedula) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos obligatorios (clave, cédula)'
            });
        }

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        const claveEncriptada = bcrypt.hashSync(clave, salt);

        // Si la cédula no existe, crear un nuevo registro en personas y usuario
        const nuevaPersonawithusuario = await User.createUser({
            clave: claveEncriptada,
            persona: {
                cedula: persona.cedula,
                correo: persona.correo ,
                nombre: persona.nombre,
                apellido: persona.apellido,
                telefono_1: persona.telefono_1,
                telefono_2: persona.telefono_2 || null,
                estado: 'A', 
                reg_usuario: usuarioCreador
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Persona y usuario registrados exitosamente',
            data: nuevaPersonawithusuario
        });
        
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
            const userToDelete = await User.findUsuario({ id_usuario });
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
    },

    async VerificarCedula(req, res) {
        try {
            const { cedula } = req.params;
            if (!cedula) {
                return res.status(400).json({
                    success: false,
                    message: 'Cédula es requerida'
                });
            }

            // Buscar persona por cédula
            const persona = await User.findUsuario({ cedula });

            // Caso 4: No existe la persona
            if (!persona) {
                return res.status(404).json({
                    success: false,
                    message: 'Persona no encontrada',
                    caso: 4
                });
            }

            // Caso 1: Persona tiene usuario asociado
            if (persona.id_usuario) {
                return res.status(200).json({
                    success: true,
                    message: 'La persona ya tiene un usuario asociado',
                    data: persona,
                    caso: 1,
                    cuentaAsociada: true
                });
            }

            // Caso 2: Persona tiene correo pero no usuario
            if (persona.correo) {
                return res.status(200).json({
                    success: true,
                    message: 'La persona tiene correo pero no tiene usuario asociado',
                    data: persona,
                    caso: 2,
                    cuentaAsociada: false,
                    correo: true
                });
            }

            // Caso 3: Persona no tiene correo ni usuario
            return res.status(200).json({
                success: true,
                message: 'La persona no tiene correo ni usuario asociado',
                data: persona,
                caso: 3,
                cuentaAsociada: false,
                correo: false
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al buscar la persona',
                error: err.message
            });
        }
    },

    async solicitarCodigo(req, res) {
        const { correo } = req.body;

        try {
            const codigo = await enviarCodigoVerificacion(correo);

            // Guardar en la base de datos
            await guardarCodigo(correo, codigo);

            res.status(200).json({ 
                mensaje: "Código enviado correctamente" 
            });
        }catch (error) {
            console.error("Error detallado:", error);
            res.status(500).json({ error: "No se pudo enviar el código" });
        }

    },

    async  verificarCodigo(req, res) {
        const { correo, codigo } = req.body;

        try {
            const valido = await verificarCodigoDB(correo, codigo);

            if (valido) {
                res.status(200).json({ 
                    success: true,
                    mensaje: "Código válido" 
                });
            } else {
                res.status(400).json({ 
                    success: false,
                    error: "Código inválido o expirado" 
                });
            }
        }catch (error) {
            console.error("Error verificando código:", error); 
            res.status(500).json({ error: "Error interno" });
        }

    },
};