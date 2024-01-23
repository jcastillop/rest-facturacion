import { Request, Response } from "express";
import Abastecimiento from "../models/abastecimiento";
import { HasMany, Op, Sequelize } from "sequelize";
import { log4js, onlyNumbers } from "../helpers";
import ipaddr from "ipaddr.js";
import Terminal from "../models/terminal";
import Isla from "../models/isla";
import Pistola from "../models/pistola";
interface ServiceParams {
    pistola?: String;
    desde?:Date;
    hasta?:Date;
    limit?: number;
    offset?: number;
}

export const getAbastecimientos = async (req: Request, res: Response) => {

    let remoteAddress = req.ip;
    let arrCodPistola: number[] = [];
    if (ipaddr.isValid(req.ip)) {
      remoteAddress = ipaddr.process(req.ip).toString();
    }

    const isla: any = await Isla.findAll({
        include: [
            { 
                model: Pistola, 
                as: 'Pistolas'
            }
        ],        
        where:{
            [Op.and]: [{ ip: remoteAddress },{ estado: 1 }]
        }, 
    });

    const pistolas: any = await Pistola.findAll();

    if(isla.length > 0){
        isla[0].Pistolas.forEach((pistola: { codigo: any; }) => {
            arrCodPistola.push(pistola.codigo)
        });
    }

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

    if(arrCodPistola.length > 0){
        queryWhere = { [Op.and] : queryAnd, pistola: { [Op.in]: arrCodPistola } }
    }else{
        queryWhere = { [Op.and] : queryAnd }
    }

    queryAnd.push({ estado: 0 });
    
    // if(arrPistolas.length > 0 && onlyNumbers(arrPistolas)){
    //     queryWhere = { [Op.and] : queryAnd, pistola: { [Op.in]: arrPistolas } }            
    // }else{
    //     queryWhere = { [Op.and] : queryAnd }
    // }

    const queryParams = {          
        where: queryWhere,
        attributes:[
            'idAbastecimiento',
            'registro',
            'pistola',
            'codigoCombustible',
            'valorTotal',
            'volTotal',
            'precioUnitario',
            'tiempo',
            'fechaHora',
            'totInicio',
            'totFinal',
            'IDoperador',
            'IDcliente',
            'volTanque',
        ],
        offset: Number(serviceParams.offset),
        limit: Number(serviceParams.limit),
        raw: true
    }

    const data: any = await Abastecimiento.findAndCountAll(queryParams);

    data.rows.map((abastecimiento: { pistola: any; descripcionCombustible: any; styleCombustible: any; }) => {
        const pistola = pistolas.filter((value: { codigo: any; }) => value.codigo === abastecimiento.pistola);            
        if(pistola){
            abastecimiento.descripcionCombustible = pistola[0].desc_producto
            abastecimiento.styleCombustible = pistola[0].color
        }
    });

    res.json({
        total: data.count, 
        abastecimientos: data.rows
    });
}

export const getCountAbastecimientos = async (req: Request, res: Response) => {

    const data: any = await Abastecimiento.findAndCountAll({ where: { estado: 0 }, raw: true });

    res.json({
        total: data.count, 
        abastecimientos: data.rows
    });
}

export const getAbastecimiento = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const pistolas: any = await Pistola.findAll({
            where:{ estado: 1 }, 
        });      

        const abastecimiento: any = await Abastecimiento.findByPk(id,{ raw: true });

        if(abastecimiento){
            const pistola = pistolas.find((obj: { codigo: any; }) => { return obj.codigo === abastecimiento.pistola; });
            abastecimiento.descripcionCombustible = pistola.desc_producto
            abastecimiento.styleCombustible = pistola.color
        }

        //log4js( abastecimiento, 'debug');
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