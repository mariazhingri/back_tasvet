const auxiliarServices = require('../services/auxiliarService');
module.exports = {
  async obtenerCitasAuxiliar(req, res) {
    try {
      console.log("Iniciando obtenerCitasAuxiliar");
      const citas = await auxiliarServices.obtenerCitasAuxiliar();
      res.status(200).json(citas);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      res.status(error.status || 500).json({ message: error.message || "Error interno del servidor" });
    }
  }
}
