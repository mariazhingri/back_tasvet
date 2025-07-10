const Usuarios = require('../modelo/user_model');
const servicioService = require('../services/servicioService');
const servicioModel = require('../modelo/servicios_model');
const e = require('express');
require('dotenv').config();

module.exports = {
  async crearServicio(req, res) {
    console.log('Iniciando creación de servicio');
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;

      const params = {
        ...body,
        id_usuario: usuario_creador,
      };
      const nuevoServicio = await servicioService.crearServicio(params);

      return res.status(201).json({
        success: true,
        message: 'Servicio creado exitosamente',
        data: nuevoServicio,
      });
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerServicios(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const servicios = await servicioService.obtenerServicios(id_usuario);

      return res.status(200).json({
        success: true,
        data: servicios,
      });
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async actualizarServicio(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_servicio, descripcion, categoria } = req.body;
      await servicioService.actualizarServicio({
        id_usuario,
        id_servicio,
        descripcion,
        categoria,
      });

      return res.status(200).json({
        success: true,
        message: 'Servicio actualizado exitosamente',
      });
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async eliminarServicio(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_servicio } = req.body;
      await servicioService.deleteService({ id_usuario, id_servicio });

      return res.status(200).json({
        success: true,
        message: 'Servicio eliminado exitosamente',
      });
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async crearServicioV2(req, res) {
    const id_usuario = req.user?.id_usuario;

    // Verifica que exista el usuario actualizador
    if (!id_usuario) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
    }

    try {
      const id_usuario = req.user?.id_usuario;
      const nuevoServicio = await servicioService.crearServicio(id_usuario, req.body);

      return res.status(201).json({
        success: true,
        message: 'Servicio creado exitosamente',
        data: nuevoServicio,
      });
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerServicios(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const servicios = await servicioService.obtenerServicios(id_usuario);

      return res.status(200).json({
        success: true,
        data: servicios,
      });
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async actualizarServicio(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_servicio, descripcion, categoria } = req.body;
      await servicioService.actualizarServicio({
        id_usuario,
        id_servicio,
        descripcion,
        categoria,
      });

      return res.status(200).json({
        success: true,
        message: 'Servicio actualizado exitosamente',
      });
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async cambiarEstadoNoDisponible(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_servicio } = req.body;
      await servicioService.cambioEstadoNoDisponible({ id_usuario, id_servicio });

      return res.status(200).json({
        success: true,
        message: 'Servicio eliminado exitosamente',
      });
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async cambiarEstadoDisponible(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_servicio } = req.body;
      await servicioService.cambioEstadoDisponible({ id_usuario, id_servicio });

      return res.status(200).json({
        success: true,
        message: 'Servicio eliminado exitosamente',
      });
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async eliminarServicioV2(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_servicio } = req.body;
      await servicioService.eliminarServicioV2({ id_usuario, id_servicio });

      return res.status(200).json({
        success: true,
        message: 'Servicio eliminado exitosamente',
      });
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async obtenerFormularios(req, res) {
    //console.log('Crear Servicio ', req.body);
    try {
      const id_usuario = req.user?.id_usuario;
      const nuevoServicio = await servicioService.obtenerFormularios(id_usuario, req.body);

      return res.status(201).json({
        success: true,
        data: nuevoServicio,
      });
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },


  async eliminarServicioDeCita(req, res) {
    try {
      const { IdCita, IdServicio } = req.params;
      console.log('data: ', req.params)

      console.log("cita_id:", IdCita, "servicio_id:", IdServicio);

      const eliminar = await servicioService.eliminarServicioDeCita({ IdCita, IdServicio });

      res.status(200).json({
        success: true,
        data: eliminar
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Error interno del servidor'
      });
    }
  },
  async agregarServicioaCita(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;

      const params = {
        ...body,
        reg_usuario: usuario_creador
      }
      console.log('data: ', params)
      const agregarServicio = await servicioService.agregarServicioaCita(params);

      res.status(200).json({
        success: true,
        data: agregarServicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Error interno del servidor'
      });
    }
  },
  // -------Graficas -----
  async obtenerServiciosMasSolicitados(req, res) {
    try {
      const { anio } = req.params;
      const servicios = await servicioModel.obtenerServiciosMasSolicitados(anio);
      return res.status(200).json({
        success: true,
        data: servicios,
      });
    } catch (error) {
      console.error('Error al obtener los servicios más solicitados:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  //PARA INSURMOS 
  async agregarVacuna(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;

      console.log('Body recibido:', req.body);

      const params = {
        ...body,
        reg_usuario: usuario_creador
      }
      console.log('data: ', params)
      const agregarServicio = await servicioService.agregarVacunas(params);

      res.status(200).json({
        success: true,
        data: agregarServicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Error interno del servidor'
      });
    }
  },

  async obtenerVacunas(req, res) {
    try {
      const servicios = await servicioModel.obtenerVacunas();
      return res.status(200).json({
        success: true,
        data: servicios,
      });
    } catch (error) {
      console.error('Error al obtener los vacunas regristradas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async actualizarVacuna(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;

      console.log('Body recibido:', req.body);

      const params = {
        ...body,
        act_usuario: usuario_creador
      }
      console.log('data: ', params)
      const agregarServicio = await servicioService.actualizarVacunas(params);

      res.status(200).json({
        success: true,
        data: agregarServicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Error interno del servidor'
      });
    }
  },

  async eliminarVacuna(req, res) {
    try {
      const usuario_eliminador = req.user?.id_usuario;
      const { id_vacuna } = req.body;
      const response = await servicioService.eliminarVacunas(
        id_vacuna,
        usuario_eliminador,
      );

      res.status(200).json({
        success: true,
        message: "Vacuna eliminado exitosamente",
        data: response
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

  //antiparasitarios
  async agregarAntiparasitario(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;

      console.log('Body recibido:', req.body);

      const params = {
        ...body,
        reg_usuario: usuario_creador
      }
      console.log('data: ', params)
      const agregarServicio = await servicioService.agregarAntiparasitario(params);

      res.status(200).json({
        success: true,
        data: agregarServicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Error interno del servidor'
      });
    }
  },

  async obtenerAntiparasitarios(req, res) {
    try {
      const servicios = await servicioModel.obtenerAntiparasitarios();
      return res.status(200).json({
        success: true,
        data: servicios,
      });
    } catch (error) {
      console.error('Error al obtener los vacunas regristradas:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  },

  async actualizarAntiparasitario(req, res) {
    try {
      const usuario_creador = req.user?.id_usuario;
      const body = req.body;

      console.log('Body recibido:', req.body);

      const params = {
        ...body,
        act_usuario: usuario_creador
      }
      console.log('data: ', params)
      const agregarServicio = await servicioService.actualizarAntiparasitario(params);

      res.status(200).json({
        success: true,
        data: agregarServicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Error interno del servidor'
      });
    }
  },

  async eliminarAntiparasitario(req, res) {
    try {
      const usuario_eliminador = req.user?.id_usuario;
      const { id_antiparasitario } = req.body;
      console.log('ID Antiparasitario recibido:', id_antiparasitario);
      const response = await servicioService.eliminarAntiparasitarios(
        id_antiparasitario,
        usuario_eliminador,
      );

      res.status(200).json({
        success: true,
        message: "Antiparasitario eliminado exitosamente",
        data: response
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




};
