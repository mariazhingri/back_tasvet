const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const key = require('../config/key');
const MascotaModal = require('../modelo/mascota_model'); 
const MascotaService = require ('../services/mascotaService');
const { ObtenerMascota } = require('../services/mascotaService');
require('dotenv').config();

module.exports = {

    async ObtenerMascota(req, res){
         try {
            const id_usuario = req.user?.id_usuario;
            const Mascotas = await MascotaModal.obtenerMascota(id_usuario);

            return res.status(200).json({
                success: true,
                data: Mascotas
            });
        } catch (error) {
            console.error('Error al obtener las mascotas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },
    async crearmascota(req, res) {
        try {
            const result = await MascotaService.createPet(req.body);
            return res.status(201).json({ 
                success: true, 
                ...result 
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    async updatemascota(req, res) {
        try{
            const usuario_actualizador = req.user?.id_usuario;
            const result = await MascotaModal.updateMascota(req.body, usuario_actualizador);

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

    // async deletemascota(req, res) {
    //     const usuario_eliminador = req.user?.id_usuario;

    //     // Verifica que exista el usuario eliminador
    //     if (!usuario_eliminador) {
    //         return res.status(401).json({
    //             success: false,
    //             message: 'No autorizado'
    //         });
    //     }

    //     try {
    //         const { mascota_id } = req.params;

    //         // Validar que se proporcione el ID de la mascota
    //         if (!mascota_id) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Se requiere el ID de la mascota'
    //             });
    //         }

    //         const result = await Mascota.deleteMascota(mascota_id, usuario_eliminador);

    //         if (!result.success) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: result.error
    //             });
    //         }

    //         res.status(200).json({
    //             success: true,
    //             message: 'Mascota eliminada exitosamente',
    //             data: {
    //                 mascota_id: result.mascota_id
    //             }
    //         });

    //     } catch (error) {
    //         console.error('Error al eliminar mascota:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Error interno del servidor',
    //             error: error.message
    //         });
    //     }
    // },

    async asignarNuevaMascota(req, res){
        try {
            const params = req.body;

            const resultado = await MascotaService.asignarNuevaMascotaACliente(params);

            if (resultado.success) {
            return res.status(200).json({
                success: true,
                message: 'Mascota asignada correctamente al cliente.',
                mascota_id: resultado.mascota_id
            });
            } else {
            return res.status(400).json({
                success: false,
                message: resultado.message || 'No se pudo asignar la mascota al cliente.'
            });
            }
        } catch (error) {
            console.error('Error en MascotaController.asignarNuevaMascota:', error);
            return res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
            error: error.message
            });
        }
    },

    async getRazas(req, res){
         try {
            const id_usuario = req.user?.id_usuario;
            const Mascotas = await MascotaModal.getRazas(id_usuario);

            return res.status(200).json({
                success: true,
                data: Mascotas
            });
        } catch (error) {
            console.error('Error al obtener las mascotas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async deleteMascota(req, res){
        try {
            const id_usuario = req.user?.id_usuario;
            const { id_mascota } = req.body;
            await MascotaModal.deleteMascota(id_mascota, id_usuario);

            return res.status(200).json({
                success: true,
                message: 'Mascota eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar la mascota:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },
    
    async obtenerMascotaDeCliente(req, res) {
        try{
            const id_usuario = req.user?.id_usuario;
            const { id_cliente } = req.params;
            const result = await MascotaModal.obtenerMascotaDeCliente(id_cliente, id_usuario);

            res.status(200).json({
                success: true,
                data: result
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
}