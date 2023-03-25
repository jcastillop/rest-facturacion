import { Request, Response } from "express";
import Abastecimiento from "../models/abastecimiento";
import { Op } from "sequelize";
import { Sqlcn } from '../database/config';

interface ServiceParams {
    pistola?: number;
    desde?:Date;
    hasta?:Date;
    limit?: number;
    offset?: number;
}

export const getAbastecimientos = async (req: Request, res: Response) => {

    const serviceParams: ServiceParams = req.query;
    //const { body } = req;
    const queryWhere = [];
    if(serviceParams.pistola){
        queryWhere.push({ pistola: Number(serviceParams.pistola) });
    }
    if(serviceParams.desde){
        queryWhere.push({ fechaHora: { [Op.gt]: new Date(serviceParams.desde) } });
    }  
    if(serviceParams.hasta){
        queryWhere.push({ fechaHora: { [Op.lt]: new Date(serviceParams.hasta) } });
    }          
    const queryParams = {
        //where: { pistola: serviceParams.pistola },
        where: { [Op.and] : queryWhere },
        attributes:['idAbastecimiento','registro','pistola','codigoCombustible','valorTotal','volTotal','precioUnitario','tiempo','fechaHora','totInicio','totFinal','IDoperador','IDcliente','volTanque'],
        offset: Number(serviceParams.offset),
        limit: Number(serviceParams.limit)
    }
    /*
    const [total, abastecimientos] = await Promise.all([
        Abastecimiento.count(),
        Abastecimiento.findAll(queryParams)
    ]);
    */

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
        if(abastecimiento){
            res.json(abastecimiento);
        }else{
            res.status(404).json({
                msg: `No existe usuarioZZZZ con el id ${ id }`
            });
        }             
    } catch (error) {
        res.status(404).json({
            msg: `No existe usuario con el123 id ${ id }`
        }); 
    }
    


    
}