const cron = require('node-cron');
const citaService = require('../citaService');

// Corre cada 10 minutos
cron.schedule('*/10 * * * * ', async () => {
  console.log('⏰ Verificando citas retrasadas...');
  await citaService.actualizarCitaRetrasadas();
});
