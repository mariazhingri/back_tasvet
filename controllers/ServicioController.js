const Usuarios = require('../modelo/user_model');
const servicioService = require('../services/servicioService');
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

  async eliminarServicio(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      const { id_servicio } = req.body;
      await servicioService.eliminarServicio({ id_usuario, id_servicio });

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
};
