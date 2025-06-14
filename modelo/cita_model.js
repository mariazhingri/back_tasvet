const db = require('../config/conexion');

const Citas = {}

Citas.obtenerCitas = async ()=> {
      try {
        sql = `select *
                from citas c
                where estado_cita  = 'Pendiente'
                `;
        const [rows] = await db.query(sql);
        return rows; 
    }catch (error) {
        throw error;
    }
}

Citas.crearCita = async (params)=> {
    try{
        const currentDate = new Date();
        const sql = `
            INSERT INTO citas (
                cliente_id, 
                mascota_id,
                empleado_id, 
                servicio_id,
                fecha_hora_cita,
                estado_cita,
                reg_fecha,
                reg_usuario
            )
            VALUES ( ?,?,?,?, ?,'Pendiente', ?, ?)
        `;
        const [result] = await db.query(sql, [
            params.cliente_id,
            params.mascota_id,
            params.empleado_id,
            params.servicio_id,
            params.fecha_hora_cita,
            currentDate,
            params.reg_usuario
        ]);

        return result.insertId;
    }catch(err){
        throw err;
    }
}

Citas.actualizarCita = async ()=> {

}

Citas.cambiarEstadoCita = async ()=> {

}

Citas.eliminarCita = async ()=> {

}

Citas.buscarCitaPorFechaHoraEmpleado = async(params)=> {
    const result = await db.query(`
        SELECT * FROM citas 
        WHERE empleado_id = ? AND fecha_hora_cita = ? 
    `, [params.empleado_id, params.fechaHora]);

    return result.length > 0 ? result[0] : null;
}




module.exports = Citas;