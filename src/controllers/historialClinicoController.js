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
    console.log('🔍 Iniciando obtenerAtencionVeterinariaPorId');
    try {
      const id_mascota = parseInt(req.params.id);

      if (isNaN(id_mascota)) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no válido o no proporcionado',
        });
      }

      console.log('🔍 ID de mascota recibido:', id_mascota);

      const atencionVeterinaria = await getAtencionVeterinariaPorId(id_mascota);
      const total = atencionVeterinaria?.length || 0;

      return res.status(200).json({
        success: true,
        message:
          total === 0
            ? `No se encontraron atenciones veterinarias para la mascota con ID ${id_mascota}`
            : `Se encontraron ${total} registro(s) de atención veterinaria`,
        data: atencionVeterinaria,
        meta: {
          total,
          id_mascota,
        },
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
      const id_mascota = parseInt(req.params.id);

      if (isNaN(id_mascota)) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no válido o no proporcionado',
        });
      }

      console.log('🔍 ID de mascota recibido:', id_mascota);

      const vacunacion = await getVacunacionPorId(id_mascota);
      const total = vacunacion?.length || 0;

      return res.status(200).json({
        success: true,
        message:
          total === 0
            ? `No se encontraron registros de vacunación para la mascota con ID ${id_mascota}`
            : `Se encontraron ${total} registro(s) de vacunación`,
        data: vacunacion,
        meta: {
          total,
          id_mascota,
        },
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
      const id_mascota = parseInt(req.params.id);

      if (isNaN(id_mascota)) {
        return res.status(400).json({
          success: false,
          message: 'ID de mascota no válido o no proporcionado',
        });
      }

      console.log('🔍 ID de mascota recibido:', id_mascota);
      const desparacitacion = await getDesparacitacionPorId(id_mascota);

      const total = desparacitacion?.length || 0;

      return res.status(200).json({
        success: true,
        message:
          total === 0
            ? `No se encontraron registros de desparasitación para la mascota con ID ${id_mascota}`
            : `Se encontraron ${total} registro(s) de desparasitación`,
        data: desparacitacion,
        meta: {
          total,
          id_mascota,
        },
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

      return res.status(200).json({
        success: true,
        data: spa,
        message: spa.length === 0 ? 'Sin historial SPA' : undefined,
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

      return res.status(200).json({
        success: true,
        data: mascotasAtendidas,
        message:
          mascotasAtendidas.length === 0
            ? 'Sin mascotas atendidas registradas'
            : 'Mascotas atendidas obtenidas correctamente',
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
