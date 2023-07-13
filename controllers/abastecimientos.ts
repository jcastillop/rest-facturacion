import { Request, Response } from "express";
import Abastecimiento from "../models/abastecimiento";
import { Op } from "sequelize";
import { log4js, onlyNumbers } from "../helpers";


interface ServiceParams {
    pistola?: String;
    desde?:Date;
    hasta?:Date;
    limit?: number;
    offset?: number;
}

export const getAbastecimientos = async (req: Request, res: Response) => {
    
    const serviceParams: ServiceParams = req.query;

    const queryAnd = [];

    var arrPistolas: string[] = [];
    var queryWhere = { };

    if(serviceParams.pistola){
        arrPistolas = serviceParams.pistola.split(',');
    }
    if(serviceParams.desde){
        queryAnd.push({ fechaHora: { [Op.gt]: new Date(serviceParams.desde) } });
    }  
    if(serviceParams.hasta){
        queryAnd.push({ fechaHora: { [Op.lt]: new Date(serviceParams.hasta) } });
    }

    queryAnd.push({ estado: 0 });

   if(arrPistolas.length > 0 && onlyNumbers(arrPistolas)){
        queryWhere = { [Op.and] : queryAnd, pistola: { [Op.in]: arrPistolas } }            
   }else{
        queryWhere = { [Op.and] : queryAnd }
   }

    const queryParams = {
        where: queryWhere,
        attributes:['idAbastecimiento','registro','pistola','codigoCombustible','valorTotal','volTotal','precioUnitario','tiempo','fechaHora','totInicio','totFinal','IDoperador','IDcliente','volTanque'],
        offset: Number(serviceParams.offset),
        limit: Number(serviceParams.limit)
    }
    const { count, rows } = await Abastecimiento.findAndCountAll(queryParams);

    res.json({
        total: count, 
        abastecimientos: rows
    });
}

export const getAbastecimiento = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {
        const abastecimiento = await Abastecimiento.findByPk(id);
        log4js( abastecimiento, 'debug');
        if(abastecimiento){
            res.json(abastecimiento);
        }else{
            res.status(404).json({
                msg: `No existe abastecimiento con el id ${ id }`
            });
        }             
    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            msg: `No existe abastecimiento con el123 id ${ id }`
        }); 
    }
}