const db = require("../config/db");

const Administrador = {};

(Administrador.changeUserRole = async (
  id_usuario_admin,
  id_usuario,
  nuevo_rol_id,
) => {
  const connection = await db.getConnection(); // Obtener conexión para transacción
  try {
    await connection.beginTransaction(); // Iniciar transacción

    // Verificar que el usuario que realiza la acción es administrador
    const [adminUser] = await connection.query(
      "SELECT rol_id FROM usuarios WHERE id_usuario = ?",
      [id_usuario_admin],
    );
    if (!adminUser.length || adminUser[0].rol_id !== 1) {
      throw new Error(
        "Acción no permitida: Solo un administrador puede cambiar roles.",
      );
    }

    // Obtener el rol actual del usuario cuyo rol será cambiado
    const [usuario] = await connection.query(
      "SELECT rol_id FROM usuarios WHERE id_usuario = ?",
      [id_usuario],
    );
    if (!usuario.length) throw new Error("Usuario no encontrado");
    const rol_actual = usuario[0].rol_id;

    // Actualizar el rol en la tabla usuarios
    await connection.query(
      "UPDATE usuarios SET rol_id = ? WHERE id_usuario = ?",
      [nuevo_rol_id, id_usuario],
    );

    // Manejar tablas específicas
    if (rol_actual === 3 && nuevo_rol_id === 2) {
      // De cliente a veterinario
      // Eliminar de clientes
      await connection.query(
        "DELETE FROM clientes WHERE persona_id = (SELECT id_persona FROM personas WHERE usuario_id = ?)",
        [id_usuario],
      );
      // Insertar en veterinarios
      await connection.query(
        "INSERT INTO veterinarios (persona_id, especialidad, estado, reg_fecha, reg_usuario) VALUES ((SELECT id_persona FROM personas WHERE usuario_id = ?), ?, ?, ?, ?)",
        [id_usuario, null, "A", new Date(), "sistema"],
      );
    } else if (rol_actual === 2 && nuevo_rol_id === 3) {
      // De veterinario a cliente
      // Eliminar de veterinarios
      await connection.query(
        "DELETE FROM veterinarios WHERE persona_id = (SELECT id_persona FROM personas WHERE usuario_id = ?)",
        [id_usuario],
      );
      // Insertar en clientes
      await connection.query(
        "INSERT INTO clientes (persona_id, direccion, estado, reg_fecha, reg_usuario) VALUES ((SELECT id_persona FROM personas WHERE usuario_id = ?), ?, ?, ?, ?)",
        [id_usuario, null, "A", new Date(), "sistema"],
      );
    }

    await connection.commit(); // Confirmar transacción
  } catch (error) {
    await connection.rollback(); // Revertir transacción en caso de error
    throw error;
  } finally {
    connection.release(); // Liberar conexión
  }
}),
  (module.exports = Administrador);
