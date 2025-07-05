const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const key = require("../config/key");
const MascotaModal = require("../modelo/mascota_model");
const MascotaService = require("../services/mascotaService");
const { ObtenerMascota } = require("../services/mascotaService");
const PersonaModel = require("../modelo/persona_model");
require("dotenv").config();

module.exports = {
  async ObtenerMascota(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const Mascotas = await MascotaModal.obtenerMascota(id_usuario);

      return res.status(200).json({
        success: true,
        data: Mascotas,
      });
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },
  async crearMascotayCliente(req, res) {
    try {
      const result = await MascotaService.crearMascotayCliente(req.body);
      return res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  async actualizarMascota(req, res) {
    try {
      const usuario_actualizador = req.user?.id_usuario;
      const body = req.body;
      const params = {
        ...body,
        act_usuario: usuario_actualizador,
      };
      const result = await MascotaService.actualizarMascota(params);

      res.status(200).json({
        success: true,
        message: "Mascota actualizada exitosamente",
        // data: {
        //     id_mascota: result.id_mascota
        // }
      });
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async asignarNuevaMascota(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;

      const params = {
        ...body,
        reg_usuario: usuario_creador,
        act_usuario: usuario_creador,
      };
      //console.log("desde front: ",params)

      const resultado =
        await MascotaService.asignarNuevaMascotaACliente(params);

      if (resultado.success) {
        return res.status(200).json({
          success: true,
          message: "Mascota asignada correctamente al cliente.",
          mascota_id: resultado.mascota_id,
        });
      } else {
        return res.status(400).json({
          success: false,
          message:
            resultado.message || "No se pudo asignar la mascota al cliente.",
        });
      }
    } catch (error) {
      console.error("Error en MascotaController.asignarNuevaMascota:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
        error: error.message,
      });
    }
  },

  async obtenerRazas(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const Mascotas = await MascotaModal.obtenerRazas(id_usuario);

      return res.status(200).json({
        success: true,
        data: Mascotas,
      });
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async obtenerMascotaPorId(req, res) {
    console.log("Obtener mascota por id");
    try {
      const { idMascota } = req.body;
      console.log("Id de cita recibida:", idMascota);

      if (!idMascota) {
        return res.status(400).json({
          success: false,
          message: "Id de la cita no proporcionada",
        });
      }

      const mascota = await MascotaModal.obtenerMascotaPorId(idMascota);

      res.status(200).json({
        success: true,
        data: mascota,
        message: "Mascota obtenida correctamente",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async obtenerMascotaPorIdUsuario(req, res) {
    console.log("Obtener mascota por id de usuario");
    try {

      const id_usuario = req.user?.id_usuario;
      console.log("Id de usuario recibido:", id_usuario);

      if (!id_usuario) {
        return res.status(400).json({
          success: false,
          message: "Id de usuario no proporcionada",
        });
      }
      const mascota = await MascotaModal.obtenerMascotaPorIdUsuario(id_usuario);

      if (!mascota || mascota.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Mascota no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        data: mascota,
        message: "Mascota obtenida correctamente",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },


  async eliminarMascota(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_mascota } = req.body;
      //console.log("datos al modelo: ", datos);
      await MascotaService.eliminarMascota(id_mascota, id_usuario);

      return res.status(200).json({
        success: true,
        message: "Mascota eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar la mascota:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async obtenerMascotaDeCliente(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_cliente } = req.params;
      const result = await MascotaModal.obtenerMascotaDeCliente(
        id_cliente,
        id_usuario,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async actualizarPersona(req, res) {
    try {
      const usuario_actualizador = req.user?.id_usuario;
      const {
        correo,
        apellidoCliente,
        nombreCliente,
        telefono_1,
        telefono_2,
        act_usuario,
        persona_id,
      } = req.body;

      const params = {
        correo,
        apellido: apellidoCliente,
        nombre: nombreCliente,
        telefono_1,
        telefono_2,
        act_usuario: usuario_actualizador,
        id_persona: persona_id,
      };

      console.log("PARAMS que le mando al service:", params);

      const personaActualizada = await PersonaModel.actualizarPersona(params);

      res.status(200).json({
        success: true,
        data: personaActualizada,
      });
    } catch (error) {
      console.error("Error al actualizar persona:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },
  // Obtiene  mascota por ID de su duenio :)
  async getMascotaByClienteId(req, res) {
    const clienteId = req.params.clienteId;

    if (!clienteId) {
      return res.status(400).json({
        success: false,
        message: "El ID del cliente es obligatorio",
      });
    }

    try {
      const mascotas = await MascotaModal.obtenerPorClienteId(clienteId);

      if (!mascotas || mascotas.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron mascotas para este cliente",
        });
      }

      res.status(200).json({
        success: true,
        data: mascotas,
      });
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async obtenerMascotasAtendidasPorAño(req, res) {
    try {
      const { anio } = req.params;
      const Mascotas = await MascotaModal.obtenerMascotasAtendidasPorAño(anio);

      return res.status(200).json({
        success: true,
        data: Mascotas,
      });
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },

  async obtenerEspeciesMasAtendidas(req, res) {
    try {
      const { anio } = req.params;
      const Mascotas = await MascotaModal.obtenerEspeciesMasAtendidas(anio);

      return res.status(200).json({
        success: true,
        data: Mascotas,
      });
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  },
};
