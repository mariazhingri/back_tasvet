const CitaModel = require('../modelo/cita_model');
const ServicioModel = require('../modelo/servicios_model');
const ClienteModel = require('../modelo/cliente_model');

const { enviarCorreoCitaAgendada } = require("./mailSend");
const Citas = require('../modelo/cita_model');


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

const objetoCita = (row) => ({
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
  servicios: JSON.parse(`[${row.servicios}]`),
});

module.exports = {
  async crearCita(params) {
    const moment = require('moment-timezone');
    const zona = 'America/Guayaquil';
    try {
      console.log('👤 Cliente a buscar mas arriba:', params);
      // 1️⃣ Validar campos obligatorios
      const camposObligatorios = ['id_cliente', 'id_mascota', 'id_servicio', 'FechaHoraInicio', 'FechaHoraFin'];
      for (let campo of camposObligatorios) {
        if (!params[campo]) {
          return { success: false, message: `El campo ${campo} es obligatorio.` };
        }
      }

      // 2️⃣ Validar que la fecha sea válida y convertir a zona horaria local
      const fechaHoraInicio = moment.tz(params.FechaHoraInicio, 'YYYY-MM-DD HH:mm:ss', zona);
      const fechaHoraFin = moment.tz(params.FechaHoraFin, 'YYYY-MM-DD HH:mm:ss', zona);
      if (!fechaHoraInicio.isValid() || !fechaHoraFin.isValid()) {
        return { success: false, message: 'La fechaHora no tiene un formato válido.' };
      }

      // 3️⃣ Validar que la fecha no sea pasada
      if (fechaHoraInicio.isBefore(moment.tz(zona))) {
        return { success: false, message: 'No se pueden agendar citas en el pasado.' };
      }

      // 4️⃣ Validar duplicados (empleado, fecha y hora exacta)
      const fechaHoraMysql = fechaHoraInicio.format('YYYY-MM-DD HH:mm'); // solo hasta minutos

      const citaExistente = await CitaModel.buscarCitaPorFechaHoraEmpleado(fechaHoraMysql, params.IdEmpleado);
      if (Array.isArray(citaExistente) && citaExistente.length > 0) {
        return { success: false, message: 'Ya existe una cita en ese horario' };
      }

      // 4️⃣.1 Validar si ya tiene una cita pendiente
      const citaPendiente = await CitaModel.buscarCitaPendientePorMascota({ mascota_id: params.id_mascota });
      if (Array.isArray(citaPendiente) && citaPendiente.length > 0) {
        return { success: false, message: 'Ya tiene una cita que no ha sido atendida aún.' };
      }

      const citaId = await CitaModel.crearCita({
        cliente_id: params.id_cliente,
        mascota_id: params.id_mascota,
        reg_usuario: params.reg_usuario,
      });

      const detallesInsertados = [];
      for (let servicio of params.id_servicio) {
        // Normalizar fechas de detalle a zona horaria local
        const fechaInicioDetalle = moment.tz(servicio.fechaInicio, 'YYYY-MM-DD HH:mm:ss', zona);
        const fechaFinDetalle = moment.tz(servicio.fechaFin, 'YYYY-MM-DD HH:mm:ss', zona);
        const detalle = await ServicioModel.crearDetalleServicio({
          cita_id: citaId,
          servicio_id: servicio.serviceId,
          empleado_id: servicio.empleadoId,
          fecha_hora_inicio: fechaInicioDetalle.isValid() ? fechaInicioDetalle.format('YYYY-MM-DD HH:mm:ss') : servicio.fechaInicio,
          fecha_hora_fin: fechaFinDetalle.isValid() ? fechaFinDetalle.format('YYYY-MM-DD HH:mm:ss') : servicio.fechaFin,
          reg_usuario: params.reg_usuario,
        });
        detallesInsertados.push(detalle);
      }

      // ✅ Buscar correo del cliente
      console.log('👤 Cliente a buscar:', params.id_cliente);
      const cliente = await ClienteModel.obtenerClientePorId(params.id_cliente)
      console.log('👤 Cliente encontrado:', cliente);
      const serviciosConNombre = [];

      // ✅ Obtener información de los servicios
      for (let servicio of params.id_servicio) {
        const infoServicio = await ServicioModel.obtenerServicioPorId(servicio.serviceId);
        serviciosConNombre.push({
          descripcion: infoServicio.descripcion,
          empleado: servicio.empleado,
          fechaInicio: servicio.fechaInicio,
          fechaFin: servicio.fechaFin,
        });
      }


      if (cliente?.correo) {
        //const fecha = new Date(params.fechaHora).toLocaleString();
        const serviciosHTML = serviciosConNombre.map(s => `
        <li>
          <strong>${s.descripcion}</strong><br>
          🐶 ${s.empleado} <br>
          🕒 ${new Date(s.fechaInicio).toLocaleString()} - ${new Date(s.fechaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </li>
      `).join('');

        const mensaje = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Hola ${cliente.nombre} ${cliente.apellido},</h2>
          <p>Tu cita ha sido agendada exitosamente. Aquí están los detalles:</p>
          <ul style="text-align: left; font-size: 16px;">
            ${serviciosHTML}
          </ul>
          <p style="margin-top: 20px;">Gracias por confiar en nosotros 🐾</p>
          <hr style="margin-top: 40px;">
          <p style="font-size: 12px; color: #777;">Este es un correo automático, por favor no responder.</p>
        </div>
      `;
        await enviarCorreoCitaAgendada(cliente.correo, "Cita agendada con éxito", mensaje);
        try {
          console.log('📨 Enviando correo a:', cliente.correo);
          await enviarCorreoCitaAgendada(cliente.correo, "Cita agendada con éxito", mensaje);
          console.log('✅ Correo enviado con éxito');
        } catch (error) {
          console.error('❌ Error al enviar correo:', error);
        }
      } else {
        console.warn('⚠️ No se encontró correo para la persona');
      }

      return {
        success: true,
        cita_id: citaId,
        detalle_servicio_id: detallesInsertados,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error al crear la cita',
        message: err.message,
      };
    }
  },


  async actualizarCitaRetrasadas() {
    await CitaModel.marcarCitasRestrasadas();
  },


  async cancelarCitas(id_cita, motivo, id_usuario) {
    return await CitaModel.cancelarCita(id_cita, motivo);
  },


  async reprogramarCitas(id_detalle_servicio, fecha_hora_inicio, fecha_hora_fin) {
    return await CitaModel.reprogramarCita(id_detalle_servicio, fecha_hora_inicio, fecha_hora_fin);
  },


  async obtenerCitas() {
    try {
      const filas = await CitaModel.obtenerCitas();
      const agrupadas = agruparCitas(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },

  async obtenerCitasRetrasadas() {
    try {
      const filas = await CitaModel.getCitasRetrasadas();
      const agrupadas = agruparCitas(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },

  async obtenerCitasCanceladas() {
    try {
      const filas = await CitaModel.getCitasCanceladas();
      const agrupadas = agruparCitas(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },


  async obtenerCitasPorIdCita(id_cita) {
    try {
      console.log('👤 Obteniendo citas por ID:', id_cita);
      const filas = await CitaModel.getCitasByIdCita(id_cita);
      const agrupadas = objetoCita(filas);
      return { success: true, data: agrupadas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },


  async obtenerCitasPorFechaIdEmpleado(fechaInicio, fechaFin, id_empleado) {
    try {
      const filas = await CitaModel.getCitasByRangoIdEmpleado(fechaInicio, fechaFin, id_empleado);
      return { success: true, data: filas };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener citas por fecha',
        error: error.message,
      };
    }
  },


};
