const ClienteModel = require("../modelo/cliente_model");
const MascotaModel = require("../modelo/mascota_model");
const PersonaModel = require("../modelo/persona_model");

module.exports = {
  async obtenerDatosClientes(id_usuario) {
    if (!id_usuario) {
      throw { status: 401, message: "Usuario no autenticado" };
    }
    const params = { id_usuario };
    const clientes = await ClienteModel.obtenerDatosCliente(params);

    return clientes;
  },

  async crearMascotayCliente(params) {
    // 1. Verificar existencia de mascota
    const existentes = await MascotaModel.verificarExistenciaMascota(
      params.nombre_mascota,
      params.especie,
      params.raza_id,
    );

    if (existentes.length > 0) {
      throw new Error(
        "Ya existe una mascota registrada con el mismo nombre, especie y raza.",
      );
    }

    // 2. Insertar persona
    const personaData = {
      cedula: params.cedula,
      nombre: params.nombreCliente,
      correo: params.correo,
      apellido: params.apellidoCliente,
      telefono_1: params.telefono_1,
      telefono_2: params.telefono_2,
      reg_usuario: params.reg_usuario,
    };
    const personaId = await PersonaModel.crearPersona(personaData);

    // 3. Insertar cliente
    const clienteData = {
      persona_id: personaId,
      direccion: params.direccion,
      reg_usuario: params.reg_usuario,
    };
    const clienteId = await ClienteModel.crearCliente(clienteData);

    // 4. Insertar mascota
    const mascotaData = {
      cliente_id: clienteId,
      nombre_mascota: params.nombre_mascota,
      especie: params.especie,
      raza_id: params.raza,
      fecha_nacimiento: params.fecha_nacimiento,
      sexo: params.sexo,
      peso_kg: params.peso_kg,
      reg_usuario: params.reg_usuario,
    };
    const mascotaId = await MascotaModel.crearMascota(mascotaData);

    return {
      persona_id: personaId,
      cliente_id: clienteId,
      mascota_id: mascotaId,
    };
  },

  async eliminarCliente(id_cliente, usuario_eliminador) {
    if (usuario_eliminador !== 1 && usuario_eliminador !== 2) {
      throw {
        status: 403,
        message: "No tiene permisos para eliminar este cliente",
      };
    }
    if (!id_cliente) {
      throw { status: 400, message: "Falta el ID del cliente" };
    }

    const ClienteEliminado = await ClienteModel.eliminarCliente(id_cliente);

    return ClienteEliminado;
  },
  async actualizarCliente(params) {
    // Validar permisos
    if (params.act_usuario !== 1 && params.act_usuario !== 2) {
      throw {
        status: 403,
        message: "No tiene permisos para actualizar este cliente",
      };
    }

    const PersonaActualizada = await PersonaModel.actualizarPersona({
      id_persona: params.id_persona,
      correo: params.correo,
      nombre: params.nombre,
      apellido: params.apellido,
      telefono_1: params.telefono_1,
      telefono_2: params.telefono_2 || null,
    });

    const clienteActualizado = await ClienteModel.actualizarCliente({
      id_cliente: params.id_cliente,
      direccion: params.direccion,
      act_usuario: params.ract_usuario,
    });

    return {
      persona_id: PersonaActualizada,
      cliente_id: clienteActualizado,
    };
  },

  async obtenerCitasDeCliente(id_usuario) {
    try {
      const rows = await ClienteModel.obtenerCitasCliente(id_usuario)
      const parse = agruparCitas(rows);
      return { success: true, data: parse };
    } catch {
      return {
        success: false,
        message: 'Error al convertir la citas',
        error: error.message,
      }
    }
  },

  async obtenerCitasDeClienteRetrasadas(id_usuario) {
    try {
      const rows = await ClienteModel.obtenerCitasClienteRetradas(id_usuario)
      const parse = agruparCitas(rows);
      return { success: true, data: parse };
    } catch {
      return {
        success: false,
        message: 'Error al convertir la citas',
        error: error.message,
      }
    }
  },

  async obtenerCitasDeClienteCanceladas(id_usuario) {
    try {
      const rows = await ClienteModel.obtenerCitasClienteCancelada(id_usuario)
      const parse = agruparCitas(rows);
      return { success: true, data: parse };
    } catch {
      return {
        success: false,
        message: 'Error al convertir la citas',
        error: error.message,
      }
    }
  }


};

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


