const db = require('../config/conexion');
const moment = require('moment-timezone');

const HistoriaClinico = {};

HistoriaClinico.getAtencionVeterinariaPorId = async (id_mascota) => {
  console.log('🔍 Iniciando getAtencionVeterinariaPorId con id_mascota:', id_mascota);
  try {
    const sql = `
SELECT 
  av.*,
  hc.id_historial_clinico,
  hc.fecha AS fecha_historial,
  ev.id_evento_clinico
FROM historial_clinico hc
JOIN evento_clinico ev ON hc.evento_clinico_id = ev.id_evento_clinico
JOIN atencion_veterinaria av ON ev.atencion_id = av.id_atencion
WHERE hc.mascota_id = ? AND hc.estado = 'A' AND ev.estado = 'A' AND av.estado = 'A';
        `;
    const [result] = await db.query(sql, [id_mascota]);
    console.log('🔍 Resultado de la consulta:', result);

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (err) {
    throw err;
  }
};

HistoriaClinico.getVacunacionPorId = async (id_mascota) => {
  console.log('🔍 Iniciando getVacunacionPorId con id_mascota:', id_mascota);
  try {
    const sql = `

SELECT 
  hc.mascota_id AS idMascota,
  cv.id_carnet_vacuna AS idVacunacion,
  cv.fecha_aplicacion AS fechaAplicacion,
  cv.peso_kg AS peso,
  cv.edad_meses AS edad,
  cv.proxima_dosis AS proximaDosis,
  v.descripcion AS vacunaDescripcion,
  cv.observaciones AS observaciones,
  CONCAT(p.nombre, ' ', p.apellido) AS empleadoNombre
FROM historial_clinico hc
JOIN evento_clinico ec ON hc.evento_clinico_id = ec.id_evento_clinico
JOIN carnets_vacunas cv ON ec.carnet_vacuna_id = cv.id_carnet_vacuna
LEFT JOIN vacunas v ON cv.vacuna_id = v.id_vacuna
LEFT JOIN empleados e ON cv.empleado_id = e.id_empleado
LEFT JOIN personas p ON e.persona_id = p.id_persona
WHERE hc.mascota_id = 1 AND hc.estado = 'A' AND cv.estado = 'A';

        `;
    const [result] = await db.query(sql, [id_mascota]);

    if (result.length === 0) {
      return null;
    }

    console.log('🔍 Resultado de la consulta vacunacion:', result);

    return result;
  } catch (err) {
    throw err;
  }
};
HistoriaClinico.getDesparacitacionPorId = async (id_mascota) => {
  console.log('🔍 Iniciando getDesparacitacionPorId con id_mascota:', id_mascota);
  try {
    const sql = `
SELECT 
  hc.mascota_id AS idMascota,
  cd.id_carnet_desparacitacion AS idCarnetDesparacitacion,
  cd.fecha_aplicacion AS fechaAplicacion,
  cd.peso_kg AS peso,
  cd.edad_meses AS edad,
  cd.proxima_dosis AS proximaDosis,
  cd.observaciones AS observaciones,
  CONCAT(p.nombre, ' ', p.apellido) AS empleadoNombre,
  a.descripcion AS antiparacitarioDescripcion
FROM historial_clinico hc
JOIN evento_clinico ec ON hc.evento_clinico_id = ec.id_evento_clinico
JOIN carnets_desparasitacion cd ON ec.carnet_desparasitacion_id = cd.id_carnet_desparacitacion
LEFT JOIN empleados e ON cd.empleado_id = e.id_empleado
LEFT JOIN personas p ON e.persona_id = p.id_persona
LEFT JOIN antiparasitarios a ON cd.antiparasitario_id = a.id_antiparasitario
WHERE hc.mascota_id = ? AND hc.estado = 'A' AND cd.estado = 'A';
        `;
    const [result] = await db.query(sql, [id_mascota]);

    if (result.length === 0) {
      return null;
    }

    console.log('🔍 Resultado de la consulta Desparacitacion:', result);

    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = HistoriaClinico;
