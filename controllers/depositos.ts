import { Request, Response } from "express";
import Depositos from '../models/depositos';
import { log4js } from "../helpers";
import { Op } from "sequelize";


export const getDepositos = async (req: Request, res: Response) => {
    
    const { id, estado = 1, limite = 15, desde = 0 } = req.params;

    try {
      
        const queryWhere = { [Op.and] : [{ CierreturnoId: null }, {UsuarioId: id}] }

        const queryParams = {
            where:  queryWhere,
            offset: Number(desde),
            limit:  Number(limite),
            raw:    true,
        }        

        const data: any = await Depositos.findAndCountAll(
            queryParams
        );
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count, 
            depositos: data.rows
        });

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
}

export const postDeposito = async (req: Request, res: Response) => {
    log4js( "Inicio postDeposito");
    const { id } = req.body;
    
    try {

        const producto = await Depositos.findOne({ where : { id: id}, raw: true});

        res.json({
            producto
        });  
        log4js( "Fin postDeposito");
    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });          
    }
    
}

export const putDeposito = async (req: Request, res: Response) => {
    log4js( "Inicio putDeposito");
    const { concepto, monto, usuario, turno, UsuarioId } = req.body;
    try {
        const deposito = Depositos.build({ 
            concepto,
            monto,
            usuario,
            turno,
            UsuarioId
        })

        await deposito.save();

    log4js( "Fin putDeposito: " + JSON.stringify(deposito));   

    if(deposito){
        res.json({
            hasError: false,
            message: `deposito creado correctamente`,
            deposito: deposito
        })         
    }else{
        res.json({
            hasError: true,
            message: `Error al crear deposito`,
            deposito: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const updateDeposito = async (req: Request, res: Response) => {
    log4js( "Inicio updateDeposito");
    const { id, concepto, monto, usuario, turno } = req.body;
    try {

        const deposito = await Depositos.update({ 
            concepto, monto, usuario, turno
        },{
            where: { id: id },
            returning: true      
        })
        

    log4js( "Fin updateDeposito: " + JSON.stringify(deposito));   

    if(deposito){
        res.json({
            hasError: false,
            message: `deposito actualizado correctamente`,
            deposito: deposito
        })                      
    }else{
        res.json({
            hasError: true,
            message: `Error al actualizar deposito`,
            deposito: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const deleteDeposito = async (req: Request, res: Response) => {
    log4js( "Inicio deleteDeposito");
    const { id } = req.body;
    try {
        const data = await Depositos.update({ estado: 0 },{
            where: { id: id },
            returning: true      
        })
    log4js( "Fin deleteDeposito: " + JSON.stringify(data));   

    if(data){
        res.json({
            hasError: false,
            message: `deposito eliminado`,
            deposito: data
        })        
    }else{
        res.json({
            hasError: true,
            message: `Error al eliminar deposito/no encontrado`,
            producto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}