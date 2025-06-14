const { obtenerCitas } = require('../modelo/cita_model');
const CitaService = require('../services/citaService');

module.exports = {
    async obtenerCitas(req, res){
        try {
            id_usuario = req.user?.id_usuario

            const citas = await obtenerCitas(id_usuario);
            
            res.status(200).json({
                success: true,
                data: citas
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

    async crearCita(req, res) {
        try {
            const usuario_creador = req.user?.id_usuario; 
            body = req.body
            const params = {
                ...body,
                reg_usuario: usuario_creador
            }
            const result = await CitaService.crearCita(params);
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
    }
}