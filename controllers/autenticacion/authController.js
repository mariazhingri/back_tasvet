const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const key = require('../../config/key');
const User = require('../../modelo/userModels'); 
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

            // Genera el token JWT
            const token = jwt.sign({ user: email }, key.JWT_SECRET, {});

            return res.status(200).json({
                message: "Login exitoso",
                user: email,
                token: `JWT ${token}`
            });

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los datos',
                error: err.message
            });
        }
    },

    async register(req, res) {
        try {
            const { rol_id, nombre, email, clave, estado, reg_fecha } = req.body;
    
            // Verificar si el usuario ya existe
            const existingUser = await User.findByUsername({ email });
            console.log('Usuario existente:', existingUser); // Debug log
    
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
            const result = await User.createUser(rol_id,nombre,email, clave, claveHash, estado,reg_fecha);
    
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
                error: err.message
            });
        }
    }
};