const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const key = require("../config/key");
const User = require("../modelo/user_model");
const { enviarCodigoVerificacion } = require("./mailSend");
const { guardarCodigo } = require("../modelo/CodigoVerificacionModel");
const { verificarCodigoDB } = require("../modelo/CodigoVerificacionModel");
const { updateClientPet } = require("./clienteService");
require("dotenv").config();

module.exports = {
  async login({ correo, clave }) {
    const user = await User.findUsuario({ correo });

    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    let isvalid;
    if (user.clave.startsWith("$2b$") || user.clave.startsWith("$2a$")) {
      isvalid = bcrypt.compareSync(clave, user.clave);
    } else {
      isvalid = clave === user.clave;
    }

    if (!isvalid) {
      throw { status: 401, message: "Acceso no autorizado" };
    }

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        nombre: user.correo,
        rol_descripcion: user.rol_descripcion,
      },
      key.JWT_SECRET,
    );

    return {
      user: correo,
      token: `JWT ${token}`,
    };
  },

  async userRegister({ clave, persona }, usuario_creador) {
    if (!clave || !persona?.cedula) {
      throw {
        status: 400,
        message: "Faltan datos obligatorios (clave, cédula)",
      };
    }

    const salt = bcrypt.genSaltSync(10);
    const claveEncriptada = bcrypt.hashSync(clave, salt);

    const nuevaPersonawithusuario = await User.createUser({
      clave: claveEncriptada,
      persona: {
        cedula: persona.cedula,
        correo: persona.correo,
        nombre: persona.nombre,
        apellido: persona.apellido,
        telefono_1: persona.telefono_1,
        telefono_2: persona.telefono_2 || null,
        estado: "A",
        reg_usuario: usuario_creador,
      },
    });

    return nuevaPersonawithusuario;
  },

  async updateUser(id_usuario, { clave, persona }, usuario_actualizador) {
    const datosActualizacion = {};

    if (clave) {
      const salt = bcrypt.genSaltSync(10);
      datosActualizacion.clave = bcrypt.hashSync(clave, salt);
    }

    if (persona?.id_persona) {
      datosActualizacion.persona = {
        id_persona: persona.id_persona,
        correo: persona.correo,
        nombre: persona.nombre,
        apellido: persona.apellido,
        telefono_1: persona.telefono_1,
        telefono_2: persona.telefono_2,
      };
    }

    // Limpiar campos undefined
    Object.keys(datosActualizacion).forEach((key) => {
      if (datosActualizacion[key] === undefined) {
        delete datosActualizacion[key];
      }
    });

    const result = await User.updateUser(
      id_usuario,
      datosActualizacion,
      usuario_actualizador,
    );
    return result;
  },

  async deleteClient() {},
};
