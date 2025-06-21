require('dotenv').config();
const FormularioModel = require('../modelo/formularios_model');
const FormulariosService = require('../services/formulariosServices')
module.exports = {

    async crearCarnetVacuna (req, res) {
       try{
        const usuario_creador = req.user?.id_usuario;
        const body = req.body;

        if (!usuario_creador) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: usuario no identificado',
      });
    }

        const params = {
            ...body,
            reg_usuario: usuario_creador
        }
        console.log("params: ", params)
        const CarnetsVacunaCreada = await FormulariosService.crearCarnetVacuna(params)

        res.status(201).json({
            success: true,
            message: 'Carnet de vacuna creado exitosamente',
            data: CarnetsVacunaCreada 
        });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }

    },

    async crearCarnetDesparasitacion (req, res) {
       try{
        const usuario_creador = req.user?.id_usuario;
        const body = req.body;

        if (!usuario_creador) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: usuario no identificado',
      });
    }

        const params = {
            ...body,
            reg_usuario: usuario_creador
        }
        console.log("params: ", params)
        const CarnetsDesparasitacionCreada = await FormulariosService.crearCarnetDesparacitacion(params)

        res.status(201).json({
            success: true,
            message: 'Carnet de desparasitacion creado exitosamente',
            data: CarnetsDesparasitacionCreada 
        });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async crearAtencionVeterinaria (req, res) {
       try{
        const usuario_creador = req.user?.id_usuario;
        const body = req.body;

        if (!usuario_creador) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: usuario no identificado',
      });
    }

        const params = {
            ...body,
            reg_usuario: usuario_creador
        }
        console.log("params: ", params)
        const AtencionVeterinaria = await FormulariosService.crearAtencionVeterinaria(params)

        res.status(201).json({
            success: true,
            message: 'Carnet de atencion veterinaria creado exitosamente',
            data: AtencionVeterinaria 
        });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async crearCarnetSpa(req, res) {
       try{
        const usuario_creador = req.user?.id_usuario;
        const body = req.body;

        if (!usuario_creador) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado: usuario no identificado',
      });
    }

        const params = {
            ...body,
            reg_usuario: usuario_creador
        }
        console.log("params: ", params)
        const CarnetsSpa = await FormulariosService.crearCarnetSpa(params)

        res.status(201).json({
            success: true,
            message: 'Carnet de Spa creado exitosamente',
            data: CarnetsSpa 
        });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async obtenerEmpleados(req, res) {
       try{
        const usuario_creador = req.user?.id_usuario;
        const body = req.body;

        const params = {
            ...body,
            reg_usuario: usuario_creador
        }
        console.log("params: ", params)
        const empleados = await FormularioModel.obtenerEmpleados(params)

        res.status(201).json({
            success: true,
            data: empleados

        });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

    async obtenerVacunas(req, res) {
       try{
        const usuario_creador = req.user?.id_usuario;
        const body = req.body;

        const params = {
            ...body,
            reg_usuario: usuario_creador
        }
        console.log("params: ", params)
        const vacunas = await FormularioModel.obtenerVacunas(params)

        res.status(201).json({
            success: true,
            data: vacunas

        });
        } catch (error) {
            console.error(error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    },

}