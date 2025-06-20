require('dotenv').config();
const { getAtencionVeterinariaPorId, getVacunacionPorId, getDesparacitacionPorId } = require('../modelo/historialClinico_model');

module.exports = {
  async obtenerAtencionVeterinariaPorId(req, res) {
    console.log('🔍 Iniciando obtenerAtencionVetPorId');
    try {
      const id_mascota = req.params.id;

      if (!id_mascota) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no proporcionado'
        });
      }


      console.log("🔍 ID de mascota recibido:", id_mascota);

      const atencionVeterinaria = await getAtencionVeterinariaPorId(id_mascota);


      if (!atencionVeterinaria || atencionVeterinaria.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Atención veterinaria no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: atencionVeterinaria
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }

  },

  async obtenerVacunacionPorId(req, res) {
    console.log('🔍 Iniciando obtenerVacunacionPorId');
    try {
      const id_mascota = req.params.id;

      if (!id_mascota) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no proporcionado'
        });
      }


      console.log("🔍 ID de mascota recibido:", id_mascota);

      const atencionVeterinaria = await getVacunacionPorId(id_mascota);


      if (!atencionVeterinaria || atencionVeterinaria.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Atención veterinaria no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: atencionVeterinaria
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }

  },

  async obtenerDesparacitacionPorId(req, res) {
    console.log('🔍 Iniciando obtenerDesparacitacionPorId');
    try {
      const id_mascota = req.params.id;

      if (!id_mascota) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no proporcionado'
        });
      }


      console.log("🔍 ID de mascota recibido:", id_mascota);
      const atencionVeterinaria = await getDesparacitacionPorId(id_mascota);


      if (!atencionVeterinaria || atencionVeterinaria.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Atención veterinaria no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: atencionVeterinaria
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }

  }


}
