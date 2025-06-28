const AuxiliarModel = require('../modelo/auxiliar_model');
module.exports = {
  async obtenerCitasAuxiliar() {
    console.log('Obteniendo citas para auxiliar...');
    const citas = await AuxiliarModel.obtenerCitaAuxiliar();
    return citas;
  }
}

