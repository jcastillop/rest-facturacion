import { Request, Response } from "express";
import Gastos from '../models/gastos';
import { log4js } from "../helpers";
import { Op } from "sequelize";


export const getGastos = async (req: Request, res: Response) => {
    
    const { id, estado = 1, limite = 15, desde = 0 } = req.params;

    try {
      
        const queryWhere = { [Op.and] : [{ CierreturnoId: null }, {UsuarioId: id}] }

        const queryParams = {
            where:  queryWhere,
            offset: Number(desde),
            limit:  Number(limite),
            raw:    true,
        }        

        const data: any = await Gastos.findAndCountAll(
            queryParams
        );
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count, 
            gastos: data.rows
        });

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
}

export const postGasto = async (req: Request, res: Response) => {
    log4js( "Inicio getGasto");
    const { id } = req.body;
    
    try {

        const producto = await Gastos.findOne({ where : { id: id}, raw: true});

        res.json({
            producto
        });  
        log4js( "Fin getGasto");
    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });          
    }
    
}

export const putGasto = async (req: Request, res: Response) => {
    log4js( "Inicio putGasto");
    const { concepto, monto, usuario_gasto, autorizado, turno, UsuarioId } = req.body;
    try {
        const gasto = Gastos.build({ 
            concepto,
            monto,
            usuario_gasto,
            autorizado,
            turno,
            UsuarioId
        })

        await gasto.save();

    log4js( "Fin putGasto: " + JSON.stringify(gasto));   

    if(gasto){
        res.json({
            hasError: false,
            message: `gasto creado correctamente`,
            gasto: gasto
        })         
    }else{
        res.json({
            hasError: true,
            message: `Error al crear gasto`,
            gasto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const updateGasto = async (req: Request, res: Response) => {
    log4js( "Inicio updateGasto");
    const { id, concepto, monto, usuario_gasto, autorizado, turno } = req.body;
    try {

        const gasto = await Gastos.update({ 
            concepto, monto, usuario_gasto, autorizado, turno
        },{
            where: { id: id },
            returning: true      
        })
        

    log4js( "Fin updateGasto: " + JSON.stringify(gasto));   

    if(gasto){
        res.json({
            hasError: false,
            message: `gasto actualizado correctamente`,
            gasto: gasto
        })                      
    }else{
        res.json({
            hasError: true,
            message: `Error al actualizar gasto`,
            gasto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const deleteGasto = async (req: Request, res: Response) => {
    log4js( "Inicio deleteGasto");
    const { id } = req.body;
    try {
        const data = await Gastos.update({ estado: 0 },{
            where: { id: id },
            returning: true      
        })
    log4js( "Fin deleteGasto: " + JSON.stringify(data));   

    if(data){
        res.json({
            hasError: false,
            message: `Gasto eliminado`,
            gasto: data
        })        
    }else{
        res.json({
            hasError: true,
            message: `Error al eliminar gasto/no encontrado`,
            producto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}