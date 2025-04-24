const db = require('../config/conexion');
const Mascota = {};

Administrador.obtenerMapaRecoleccionProvincia = (result) => {

    const sql = ``

    db.query(sql, params, (err, data) => {
        if (err) {
            result(err, null);
        } else {
            result(null, data);
        }
    });
}

module.exports = Mascota;