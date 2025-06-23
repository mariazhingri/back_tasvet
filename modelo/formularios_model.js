const db = require("../config/conexion");

const formularios = {};

formularios.crearCarnetVacuna = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO carnets_vacunas (
                empleado_id, 
                vacuna_id,  
                fecha_aplicacion,
                peso_kg,
                edad_meses,
                proxima_dosis,
                observaciones,
                estado,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?,?,?,?,?,?,?,?,?)
        `;
    const [result] = await db.query(sql, [
      params.empleado_id,
      params.vacuna_id,
      params.fecha_aplicacion,
      params.peso_kg,
      params.edad_meses,
      params.proxima_dosis,
      params.observaciones,
      "A",
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

formularios.crearCarnetDesparacitacion = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO carnets_desparasitacion (
                empleado_id, 
                antiparasitario_id,  
                fecha_aplicacion,
                peso_kg,
                edad_meses,
                proxima_dosis,
                observaciones,
                estado,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?,?,?,?,?,?,?,?,?)
        `;
    const [result] = await db.query(sql, [
      params.empleado_id,
      params.antiparasitario_id,
      params.fecha_aplicacion,
      params.peso_kg,
      params.edad_meses,
      params.proxima_dosis,
      params.observaciones,
      "A",
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

formularios.crearAtencionVeterinaria = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO atencion_veterinaria (
                empleado_id, 
                temperatura,  
                peso,
                edad_meses,
                sintomas,
                diagnostico,
                tratamiento,
                resultados_examenes,
                observaciones,
                estado,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?)
        `;
    const [result] = await db.query(sql, [
      params.empleado_id,
      params.temperatura,
      params.peso,
      params.edad_meses,
      params.sintomas,
      params.diagnostico,
      params.tratamiento,
      params.resultados_examenes,
      params.observaciones,
      "A",
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

formularios.crearCarnetsSpa = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO carnets_spa (
                empleado_id, 
                peso_kg,
                corte_pelo,
                estilo,
                baño,
                oidos,
                uñas,
                hora_ingreso,
                hora_entrega,
                observaciones,
                estado,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;
    const [result] = await db.query(sql, [
      params.empleado_id,
      params.peso_kg,
      params.corte_pelo,
      params.estilo,
      params.baño,
      params.oidos,
      params.uñas,
      params.hora_ingreso,
      params.hora_entrega,
      params.observaciones,
      "A",
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

formularios.crearEventoClinico = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO evento_clinico (
                carnet_vacuna_id, 
                atencion_id,
                carnet_spa_id,
                carnet_desparasitacion_id,
                estado,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?,?,?,?,?,?)
        `;
    const [result] = await db.query(sql, [
      params.carnet_vacuna_id,
      params.atencion_id,
      params.carnet_spa_id,
      params.carnet_desparasitacion_id,
      "A",
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

formularios.crearHistorialClinico = async (params) => {
  try {
    const currentDate = new Date();

    const sql = `
            INSERT INTO historial_clinico (
                mascota_id, 
                evento_clinico_id,
                numero_historia_clinica,
                antecedentes_veterinarios_id,
                fecha,
                estado,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?,?,?,?,?,?,?)
        `;
    const [result] = await db.query(sql, [
      params.mascota_id,
      params.evento_clinico_id,
      params.numero_historia_clinica,
      params.antecedentes_veterinarios_id,
      params.fecha,
      "A",
      currentDate,
      params.reg_usuario,
    ]);

    return result.insertId;
  } catch (error) {
    throw error;
  }
};

formularios.obtenerEmpleados = async (params) => {
  try {
    const sql = `
            select id_empleado, p.nombre,p.apellido,e.cargo, e.descripcion
            from empleados e
            INNER JOIN personas p on e.persona_id = p.id_persona
            where e.estado = 'A'
            AND p.estado = 'A'
            `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

formularios.obtenerVacunas = async (params) => {
  try {
    const sql = `
            select id_vacuna, nombre_vacuna, descripcion
            from vacunas v
            where estado = 'A'
            `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

formularios.calcularNumeroHistoriaClinica = async(params) =>{
  try{
     sql =`SELECT 
     COALESCE(MAX(numero_historia_clinica), 0) + 1 AS siguiente_historia 
     FROM historial_clinico 
     WHERE mascota_id = ?`;
    
    const [rows] = await db.query(sql, [params.mascota_id]);

    return rows[0].siguiente_historia;
  }catch(err){
    throw err
  }
  
}

formularios.obtenerAntiparasitarios = async(params) =>{
      try {
    const sql = `
            select id_antiparasitario, nombre_antiparasitario, descripcion
            from antiparasitarios a
            where estado = 'A'
            `;
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
}

formularios.eliminarServicioDeCita = async ({ cita_id, servicio_id }) => {
  console.log('Eliminar detalle_servicio con:', { cita_id, servicio_id });

  if (cita_id == null || servicio_id == null) {
    throw new Error('cita_id y servicio_id son obligatorios');
  }

  try {
    const sql = `
      DELETE FROM detalle_servicios
      WHERE cita_id = ? AND servicio_id = ?
    `;
    const [rows] = await db.query(sql, [cita_id, servicio_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};



module.exports = formularios;
