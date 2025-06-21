require('dotenv').config();
const {
  getAtencionVeterinariaPorId,
  getVacunacionPorId,
  getDesparacitacionPorId,
  getSpaPorId,
  getMascotasAtendidas: getObtenerMascotasAtendidas,
  getMascotasAtendidas,
} = require('../modelo/historialClinico_model');

module.exports = {
  async obtenerAtencionVeterinariaPorId(req, res) {
    console.log('🔍 Iniciando obtenerAtencionVetPorId');
    try {
      const id_mascota = req.params.id;

      if (!id_mascota) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no proporcionado',
        });
      }

      console.log('🔍 ID de mascota recibido:', id_mascota);

      const atencionVeterinaria = await getAtencionVeterinariaPorId(id_mascota);

      if (!atencionVeterinaria || atencionVeterinaria.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Atención veterinaria no encontrada',
        });
      }

      res.status(200).json({
        success: true,
        data: atencionVeterinaria,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
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
          message: 'ID de mascota no proporcionado',
        });
      }

      console.log('🔍 ID de mascota recibido:', id_mascota);

      const vacunacion = await getVacunacionPorId(id_mascota);

      if (!vacunacion || vacunacion.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Historial vacuanacion  no encontrada',
        });
      }

      res.status(200).json({
        success: true,
        data: vacunacion,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
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
          message: 'ID de mascota no proporcionado',
        });
      }

      console.log('🔍 ID de mascota recibido:', id_mascota);
      const desparacitacion = await getDesparacitacionPorId(id_mascota);

      if (!desparacitacion || desparacitacion.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Historial desparacitacion no encontrada',
        });
      }

      res.status(200).json({
        success: true,
        data: desparacitacion,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  },

  async obtenerSpaPorId(req, res) {
    console.log('🔍 Iniciando obtener SpaPorId');
    try {
      const id_mascota = req.params.id;

      if (!id_mascota) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no proporcionado',
        });
      }

      console.log('🔍 ID de mascota recibido:', id_mascota);
      const spa = await getSpaPorId(id_mascota);

      if (!spa || spa.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Historial spa no encontrada',
        });
      }

      res.status(200).json({
        success: true,
        data: spa,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  },

  async obtenerMascotasAtendidas(req, res) {
    console.log('🔍 Iniciando obtener mascotas atendidas');
    try {
      const mascotasAtendidas = await getMascotasAtendidas();

      if (!mascotasAtendidas || mascotasAtendidas.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Historial de mascotas atendidas no obetenido',
        });
      }

      res.status(200).json({
        success: true,
        data: mascotasAtendidas,
        message: 'Mascotas atendidas obtenidas correctamente',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  },
};
