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


module.exports = {
  async crearCita(params) {
    try {
      console.log('👤 Cliente a buscar mas arriba:', params.id_cliente);
      // 1️⃣ Validar campos obligatorios
      const camposObligatorios = ['id_cliente', 'id_mascota', 'id_servicio', 'FechaHoraInicio', 'FechaHoraFin', 'IdEmpleado'];
      for (let campo of camposObligatorios) {
        if (!params[campo]) {
          return { success: false, message: `El campo ${campo} es obligatorio.` };
        }
      }

      // 2️⃣ Validar que la fecha sea válida
      const fechaHoraInicio = new Date(params.FechaHoraInicio);
      const fechaHoraFin = new Date(params.FechaHoraFin);
      if (isNaN(fechaHoraInicio) || isNaN(fechaHoraFin)) {
        return { success: false, message: 'La fechaHora no tiene un formato válido.' };
      }

      // 3️⃣ Validar que la fecha no sea pasada
      if (fechaHoraInicio < new Date()) {
        return { success: false, message: 'No se pueden agendar citas en el pasado.' };
      }

      // 4️⃣ Validar duplicados (empleado, fecha y hora exacta)
      const fechaHoraMysql = fechaHoraInicio.toISOString().slice(0, 16).replace('T', ' '); // solo hasta minutos

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
      for (let servicioId of params.id_servicio) {
        const detalle = await ServicioModel.crearDetalleServicio({
          cita_id: citaId,
          servicio_id: servicioId,
          empleado_id: params.IdEmpleado,
          fecha_hora_inicio: params.FechaHoraInicio,
          fecha_hora_fin: params.FechaHoraFin,
          reg_usuario: params.reg_usuario,
        });
        detallesInsertados.push(detalle);
      }
      // ✅ Buscar correo del cliente
      console.log('👤 Cliente a buscar:', params.id_cliente);
      const cliente = await ClienteModel.obtenerClientePorId(params.id_cliente)
      console.log('👤 Cliente encontrado:', cliente);

      if (cliente?.correo) {
        const fecha = new Date(params.fechaHora).toLocaleString();
        const mensaje = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; color: #333;">

          <h2 style="font-size: 24px; margin-bottom: 10px;">Hola ${cliente.nombre} ${cliente.apellido},</h2>

          <p style="font-size: 18px; margin-bottom: 30px;">
            Tu cita ha sido agendada exitosamente.
          </p>

          <p style="font-size: 20px; font-style: italic; font-weight: bold; color: #2a7ae2; margin-bottom: 30px;">
            🕒 ${fecha}
          </p>

          <p style="font-size: 16px;">Gracias por confiar en nosotros 🐾</p>

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
        //message: err.message,
      };
    }
  },

  async actualizarCitaRetrasadas() {
    await CitaModel.marcarCitasRestrasadas();
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

};
