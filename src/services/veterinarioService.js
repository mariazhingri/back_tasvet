const VeterinarioModel = require('../modelo/veterinario_model');
const PersonaModel = require('../modelo/persona_model');
const UsuarioModel = require('../modelo/user_model');
const EmpleadoModel = require('../modelo/empleado_model');
const bcrypt = require("bcryptjs");

const agruparCitas = (filas) => {
  return filas.map(row => ({
    id_cita: row.id_cita,
    estado_cita: row.estado_cita,

    id_mascota: row.id_mascota,
    nombre_mascota: row.nombre_mascota,
    especie: row.especie,
    nombre_raza: row.nombre_raza,
    fecha_nacimiento: row.fecha_nacimiento,

    nombre: row.nombre,
    apellido: row.apellido,
    telefono: row.telefono_1,
    direccion: row.direccion,

    servicios: JSON.parse(`[${row.servicios}]`) // <- parseamos el string JSON en array
  }));
};

module.exports = {
  async atencionVeterinaria (id_mascota) {
    //console.log('Obteniendo citas para auxiliar...');
    const citas = await VeterinarioModel.atencionVeterinaria(id_mascota);
    const agrupadas = agruparCitas(citas);
    return {success: true,message: 'Citas obtenidas correctamente',data: agrupadas};
  },


}

