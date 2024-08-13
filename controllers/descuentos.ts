import { Request, Response } from "express";
import { log4js } from "../helpers";
import { Op } from "sequelize";
import Producto from "../models/producto";
import Receptor from "../models/receptor";
import { Descuentos, obtenerDescuentos } from "../models/descuentos";


export const getDescuentos = async (req: Request, res: Response) => {
    
    const { id, estado = 1, limite = 15, desde = 0 } = req.params;

    try {
      
        const data: any = await obtenerDescuentos()
        res.json({
            message: data.message,
            descuentos: data.data
        });

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
}

export const postDescuento= async (req: Request, res: Response) => {
    log4js( "Inicio postDescuento");
    const { id } = req.body;
    
    try {

        const descuento = await Descuentos.findOne({ where : { id: id}, raw: true});

        res.json({
            descuento
        });  
        log4js( "Fin postDescuento");
    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });          
    }
    
}

export const putDescuento = async (req: Request, res: Response) => {
    log4js( "Inicio putDeposito");
    const { codigo_producto, numero_documento, monto_descuento, tipo } = req.body;
    try {

        const invalid = await Descuentos.findOne({ where : { numero_documento: numero_documento, codigo_producto: codigo_producto }, raw: true});

        if(invalid){
            res.json({
                hasError: true,
                message: `Ya existe un descuento registrado al cliente`,
                descuento: null
            })            
        }else{
            const descuento = Descuentos.build({ 
                codigo_producto,
                numero_documento,
                monto_descuento,
                tipo
            })
    
            await descuento.save();
    
            log4js( "Fin putDeposito: " + JSON.stringify(descuento));   
        
            if(descuento){
                res.json({
                    hasError: false,
                    message: `descuento creado correctamente`,
                    descuento: descuento
                })         
            }else{
                res.json({
                    hasError: true,
                    message: `Error al crear descuento`,
                    descuento: null
                })
            }   
        }       

    } catch (error) {
        console.log(error)
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const updateDescuento = async (req: Request, res: Response) => {
    log4js( "Inicio updateDescuento");
    const { id, codigo_producto, numero_documento, monto_descuento, tipo, fecha } = req.body;
    try {

        const descuento = await Descuentos.update({ 
            codigo_producto,
            numero_documento,
            monto_descuento,
            tipo,
            fecha
        },{
            where: { id: id },
            returning: true      
        })
        

    log4js( "Fin updateDescuento: " + JSON.stringify(descuento));   

    if(descuento){
        res.json({
            hasError: false,
            message: `descuento actualizado correctamente`,
            descuento: descuento
        })                      
    }else{
        res.json({
            hasError: true,
            message: `Error al actualizar descuento`,
            descuento: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const deleteDescuento = async (req: Request, res: Response) => {
    log4js( "Inicio deleteDescuento");
    const { id } = req.body;
    try {
        const data = await Descuentos.update({ estado: 0 },{
            where: { id: id },
            returning: true      
        })
    log4js( "Fin deleteDescuento: " + JSON.stringify(data));   

    if(data){
        res.json({
            hasError: false,
            message: `descuento eliminado`,
            deposito: data
        })        
    }else{
        res.json({
            hasError: true,
            message: `Error al eliminar descuento/no encontrado`,
            descuento: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}