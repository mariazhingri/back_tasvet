const Usuarios = require('../modelo/user_model');
const Servicio = require('../modelo/servicios_model');

module.exports = {
  async obtenerServicios(id_usuario) {
    if (!id_usuario) {
      throw { status: 401, message: 'Usuario no autenticado' };
    }

    const servicios = await Servicio.obtenerServicios();
    return servicios;
  },

  async crearServicio(params) {
    user = params.id_usuario;
    if (!params.id_usuario) {
      throw { status: 401, message: 'No autorizado' };
    }

    const userRol = await Usuarios.findUsuario({ id_usuario: user });
    if (userRol.rol_id !== 1 && params.rol_id !== 2) {
      throw { status: 403, message: 'Acción no permitida' };
    }

    if (!params.descripcion || !params.categoria) {
      throw { status: 400, message: 'Faltan campos obligatorios' };
    }

    const nuevoServicio = await Servicio.crearServicio({
      descripcion: params.descripcion,
      categoria: params.categoria,
      formulario: params.formulario,
      reg_usuario: user,
    });

    return nuevoServicio;
  },

  async crearServicioV2(id_usuario, data) {
    if (!id_usuario) {
      throw { status: 401, message: 'No autorizado' };
    }

    const userRol = await Usuarios.findUsuario({ id_usuario });
    // console.log(userRol);

    if (!userRol || (userRol.rol_id !== 1 && userRol.rol_id !== 2)) {
      throw { status: 403, message: 'Acción no permitida' };
    }

    const { descripcion, categoria, formulario } = data;

    if (!descripcion || !categoria) {
      throw { status: 400, message: 'Faltan campos obligatorios' };
    }

    const nuevoServicio = await Servicio.crearServicioV2({
      descripcion,
      categoria,
      formulario,
      reg_usuario: id_usuario,
    });

    return nuevoServicio;
  },

  async actualizarServicio({ id_usuario, id_servicio, descripcion, categoria }) {
    if (!id_usuario) {
      throw { status: 401, message: 'Usuario no autenticado' };
    }

    const userRol = await Usuarios.findUsuario({ id_usuario });

    // if (!userRol || (userRol.rol_id !== 1 && userRol.rol_id !== 2)) {
    //     throw { status: 403, message: 'Acción no permitida' };
    // }

    if (!id_servicio || !descripcion || !categoria) {
      throw { status: 400, message: 'Faltan campos obligatorios' };
    }

    const resultado = await Servicio.actualizarServicio({
      id_servicio,
      descripcion,
      categoria,
      act_usuario: id_usuario,
    });

    if (resultado === 0) {
      throw { status: 404, message: 'Servicio no encontrado' };
    }

    return true;
  },

  async eliminarServicio({ id_usuario, id_servicio }) {
    if (!id_usuario) {
      throw { status: 401, message: 'Usuario no autenticado' };
    }

    const userRol = await Usuarios.findUsuario({ id_usuario });
    if (!userRol || (userRol.rol_id !== 1 && userRol.rol_id !== 2)) {
      throw { status: 403, message: 'Acción no permitida' };
    }

    if (!id_servicio) {
      throw { status: 400, message: 'Falta el ID del servicio' };
    }

    const resultado = await Servicio.eliminarServicio(id_servicio);

    if (resultado === 0) {
      throw { status: 404, message: 'Servicio no encontrado' };
    }

    return true;
  },


  async eliminarServicioV2({ id_servicio, id_usuario }) {
    if (!id_usuario) {
      throw { status: 401, message: 'Usuario no autenticado' };
    }

    const userRol = await Usuarios.findUsuario({ id_usuario });
    if (!userRol || (userRol.rol_id !== 1 && userRol.rol_id !== 2)) {
      throw { status: 403, message: 'Acción no permitida' };
    }

    if (!id_servicio) {
      throw { status: 400, message: 'Falta el ID del servicio' };
    }

    const resultado = await Servicio.eliminarServicioV2(id_servicio, id_usuario);

    if (resultado === 0) {
      throw { status: 404, message: 'Servicio no encontrado' };
    }

    return true;
  },

  async obtenerFormularios(id_usuario) {
    if (!id_usuario) {
      throw { status: 401, message: 'Usuario no autenticado' };
    }

    const servicios = await Servicio.obtenerFomularios();
    return servicios;
  },

  async listarFormularios(id_usuario) {
    if (!id_usuario) {
      throw { status: 401, message: 'Usuario no autenticado' };
    }

    const servicios = await Servicio.listarFormularios();
    return servicios;
  },
};
