const VeterinarioModel = require("../modelo/veterinario_model");
const VeterinarioService = require("../services/veterinarioService");
module.exports = {
    // Obtiene las mascotas agendadas para el veterinario
    // Esta función utiliza el id_usuario del token para filtrar las mascotas
    async MascotasAgendadas (req, res) {
        try {
           
            const id_usuario = req.user?.id_usuario;
             console.log("id veterinario: ", id_usuario)
            const mascotas = await VeterinarioModel.MascotasAgendadas(id_usuario);
            return res.status(201).json({
                success: true,
                message: 'Datos de la mascota',
                data: mascotas,
            });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las mascotas agendadas" });
        }
    },
// Obtiene las citas de atención veterinaria para el veterinario
// sacandolas del id_mascota
    async atencionVeterinaria (req, res) {
        try {
            const id_usuario = req.user?.id_usuario;
            const id_mascota = req.params.id_mascota;
            const citas = await VeterinarioService.atencionVeterinaria(id_mascota);
            return res.status(200).json({
                success: true,
                message: 'Citas de atención veterinaria',
                data: citas,
            });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las citas de atención veterinaria" });
        }
    }
};