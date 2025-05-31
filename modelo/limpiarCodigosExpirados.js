const db = require('../config/conexion');
const cron = require('node-cron');

const LimpiarCodigosExpirados = {};

// Ejecuta una vez al dia

cron.schedule('0 2 * * *', async () => {
    try {
        const sql = `
            DELETE FROM codigos_verificacion
            WHERE expiracion < NOW() OR usado = 1`;

        await db.execute(sql);
        console.log('Códigos expirados y usados eliminados');
    } catch (error) {
        console.error('Error limpiando códigos:', error);
    }
});

module.exports = LimpiarCodigosExpirados;