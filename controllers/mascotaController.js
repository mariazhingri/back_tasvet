const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const key = require('../config/key');
const Mascota = require('../modelo/mascota_model'); 
require('dotenv').config();

module.exports = {
    async crearmascota(req, res) {
    const usuario_actualizador = req.user?.id_usuario;

    // Verifica que exista el usuario actualizador
    if (!usuario_actualizador) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado'
        });
    }

    try {
        const {
            nombre_mascota,
            especie_id,
            raza_id,
            fecha_nacimiento,
            sexo,
            peso_kg,
            cliente
        } = req.body;

        // Validar que cliente y cliente.persona existan
        if (!cliente || !cliente.persona) {
            return res.status(400).json({
                success: false,
                message: 'El cliente y sus datos personales son obligatorios'
            });
        }

        const { cedula, nombre_cliente, apellido_cliente, telefono } = cliente.persona;
        //console.log('Cedula recibida:', cedula);

        // Validaciones básicas
        if (!nombre_mascota || !especie_id || !nombre_cliente || !apellido_cliente || !telefono || !cedula) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios'
            });
        }
        // console.log('Datos enviados a crearMascota:', {
        //     nombre_mascota,
        //     especie_id,
        //     raza_id,
        //     fecha_nacimiento,
        //     sexo,
        //     peso_kg,
        //     direccion: cliente.direccion,
        //     cedula,
        //     nombre_cliente,
        //     apellido_cliente,
        //     telefono,
        //     reg_usuario: usuario_actualizador
        // });

        const result = await Mascota.crearMascota({
            nombre_mascota,
            especie_id,
            raza_id,
            fecha_nacimiento,
            sexo,
            peso_kg,
            direccion: cliente.direccion,
            cedula,
            nombre_cliente,
            apellido_cliente,
            telefono,
            reg_usuario: usuario_actualizador
        });

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error
            });
        }

        res.status(201).json({
            success: true,
            message: 'Mascota registrada exitosamente',
            data: {
                cliente_id: result.cliente_id,
                mascota_id: result.mascota_id,
            }
        });

    } catch (error) {
        console.error('Error al crear mascota:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
},

    async updatemascota(req, res) {
        const usuario_actualizador = req.user?.id_usuario;

        // Verifica que exista el usuario actualizador
        if (!usuario_actualizador) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        try {
            const { mascota_id } = req.params;
            const {
                // Datos del contacto
                nombre_contacto,
                apellido_contacto,
                telefono,
                email,
                direccion,
    
                // Datos de la mascota
                nombre_mascota,
                especie_id,
                raza_id,
                fecha_nacimiento,
                edad_meses,
                sexo,
                peso_kg,
                color_pelaje
            } = req.body;

            // Validaciones básicas
            const camposRequeridos = {
                'ID de mascota': mascota_id,
                'Nombre del contacto': nombre_contacto,
                'Apellido del contacto': apellido_contacto,
                'Teléfono': telefono,
                'Nombre de la mascota': nombre_mascota,
                'ID de especie': especie_id
            };

            const camposFaltantes = Object.entries(camposRequeridos)
                .filter(([, valor]) => !valor)
                .map(([campo]) => campo);

            if (camposFaltantes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
                });
            }

            const params = {
                // Datos del contacto
                nombre_contacto,
                apellido_contacto,
                telefono,
                email,
                direccion,
    
                // Datos de la mascota
                nombre_mascota,
                especie_id,
                raza_id,
                fecha_nacimiento,
                edad_meses,
                sexo,
                peso_kg,
                color_pelaje
            };

            const result = await Mascota.updateMascota(mascota_id, params, usuario_actualizador);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Mascota actualizada exitosamente',
                data: {
                    mascota_id: result.mascota_id
                }
            });

        } catch (error) {
            console.error('Error al actualizar mascota:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async deletemascota(req, res) {
        const usuario_eliminador = req.user?.id_usuario;

        // Verifica que exista el usuario eliminador
        if (!usuario_eliminador) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado'
            });
        }

        try {
            const { mascota_id } = req.params;

            // Validar que se proporcione el ID de la mascota
            if (!mascota_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere el ID de la mascota'
                });
            }

            const result = await Mascota.deleteMascota(mascota_id, usuario_eliminador);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Mascota eliminada exitosamente',
                data: {
                    mascota_id: result.mascota_id
                }
            });

        } catch (error) {
            console.error('Error al eliminar mascota:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

}