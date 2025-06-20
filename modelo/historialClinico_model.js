const db = require('../config/conexion');
const moment = require('moment-timezone');

const HistoriaClinico = {}

HistoriaClinico.getAtencionVeterinariaPorId = async (id_mascota) => {
  console.log("🔍 Iniciando getAtencionVeterinariaPorId con id_mascota:", id_mascota);
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
    console.log("🔍 Resultado de la consulta:", result);

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (err) {
    throw err;
  }
}
module.exports = HistoriaClinico;

