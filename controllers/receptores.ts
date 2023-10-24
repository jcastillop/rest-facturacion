import { Request, Response } from "express";
import Receptor from "../models/receptor";
import { Op } from "sequelize";
import { log4js } from "../helpers";
import { consultaRucMiFact } from "../helpers/api-mifact";

export const autocompletarRuc = async (req: Request, res: Response) => {

    const { valor } = req.body;
    const {hasErrorMiFact, messageMiFact, razon_social, direccion} = await consultaRucMiFact(valor);

    if(hasErrorMiFact){
        const receptores = await Receptor.findAll({
            where: {
                numero_documento: {
                [Op.like]: `${valor}%`
                }
            }, 
            raw: true
        });
        res.json({
            receptores
        });
    }else{
        res.json({
            receptores: [
                {
                    "numero_documento": valor,
                    "razon_social": razon_social,
                    "direccion": direccion
                }
            ]
        });        
    }

}

export const geReceptores = async (req: Request, res: Response) => {
    
    const { estado = 1, limite = 15, desde = 0 } = req.query;

    try {

        const queryParams = {
            offset: Number(desde),
            limit:  Number(limite),
            raw:    true
        }        

        const data: any = await Receptor.findAndCountAll(
            queryParams
        );
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count, 
            receptores: data.rows
        });

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
}

export const putReceptor = async (req: Request, res: Response) => {
    log4js( "Inicio putReceptor");
    const { numero_documento, tipo_documento, razon_social, direccion, correo, placa } = req.body;
    try {
        const receptor = Receptor.build({ 
            numero_documento,
            tipo_documento,
            razon_social,
            direccion,
            correo,
            placa
        })

        await receptor.save();

    log4js( "Fin putReceptor: " + JSON.stringify(receptor));   

    if(receptor){
        res.json({
            hasError: false,
            message: `receptor creado correctamente`,
            receptor: receptor
        })         
    }else{
        res.json({
            hasError: true,
            message: `Error al crear producto`,
            receptor: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}


export const updateReceptor = async (req: Request, res: Response) => {
    log4js( "Inicio updateReceptor");
    const { id, numero_documento, tipo_documento, razon_social, direccion, correo, placa } = req.body;
    try {

        const receptor = await Receptor.update({ 
            numero_documento,
            tipo_documento,
            razon_social,
            direccion,
            correo,
            placa
        },{
            where: { id: id },
            returning: true      
        })
        

    log4js( "Fin updateReceptor: " + JSON.stringify(receptor));   

    if(receptor){
        res.json({
            hasError: false,
            message: `receptor actualizado correctamente`,
            producto: receptor
        })                      
    }else{
        res.json({
            hasError: true,
            message: `Error al actualizar receptor`,
            producto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}