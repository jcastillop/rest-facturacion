import { Request, Response } from "express";
import {Op, literal } from "sequelize";
import Abastecimiento from "../models/abastecimiento";
import { log4js } from "../helpers";
import ipaddr from "ipaddr.js";

import Isla from "../models/isla";
import Pistola from "../models/pistola";
import { Literal } from "sequelize/types/utils";
import { IComprobanteAdmin } from "../interfaces";
import { automatismoGenerarComprobantes } from "../helpers/app-helpers";
interface ServiceParams {
    id?: String;
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

    queryAnd.push({ estado: 0 });
    
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

    //
    
    // if(arrPistolas.length > 0 && onlyNumbers(arrPistolas)){
    //     queryWhere = { [Op.and] : queryAnd, pistola: { [Op.in]: arrPistolas } }            
    // }else{
    //     queryWhere = { [Op.and] : queryAnd }
    // }

    var fields: any [] = [
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
        'volTanque'
    ]

    //process.env.EMISOR_DIR,
    // ${process.env.MODIFY_TIMEZONE!}
    var time = process.env.AUTOMATIC_BILLING_TIMEOUT!.split(' ');
    if(process.env.AUTOMATIC_BILLING == '1' && process.env.MODIFY_TIMEZONE && time.length == 3){
        fields.push([literal(`DATEADD(hour , ${process.env.MODIFY_TIMEZONE!} , getdate())`), 'actual'])
        fields.push([literal(`CASE WHEN DATEDIFF(minute, fechaHora, dateadd(hour , ${process.env.MODIFY_TIMEZONE} , getdate())) < ${time[0]} THEN 3 WHEN DATEDIFF(minute, fechaHora, dateadd(hour , ${process.env.MODIFY_TIMEZONE} , getdate())) < ${time[1]} THEN 2 WHEN DATEDIFF(minute, fechaHora, dateadd(hour , ${process.env.MODIFY_TIMEZONE} , getdate())) < ${time[2]} THEN 1 ELSE 0 END`), 'alertAutomatic'])
    }

    const data: any = await Abastecimiento.findAndCountAll({
        where: queryWhere,
        attributes: { include: fields }, 
        offset: Number(serviceParams.offset),
        limit: Number(serviceParams.limit),
        raw: true        
    });

    

    data.rows.map((abastecimiento: { idAbastecimiento: any; pistola: any; descripcionCombustible: any; styleCombustible: any; fechaHora:any; alertAutomatic:any; valorTotal:any}) => {
        const pistola = pistolas.filter((value: { codigo: any; }) => value.codigo === abastecimiento.pistola);            
        if(pistola){
            abastecimiento.descripcionCombustible = pistola[0].desc_producto
            abastecimiento.styleCombustible = pistola[0].color
        }

    });

    if(data.rows[0]){
        const abastecimiento = data.rows[0];
        if(process.env.AUTOMATIC_BILLING == '1' && process.env.MODIFY_TIMEZONE && time.length == 3 && abastecimiento.alertAutomatic == 0){
            console.log(serviceParams.id)
            console.log(abastecimiento.idAbastecimiento)
            automatismoGenerarComprobantes(abastecimiento.idAbastecimiento, Number(serviceParams.id), abastecimiento.descripcionCombustible, abastecimiento.valorTotal)
        }   
    }

    //facturacion automatica
    //que no sean usuarios administradores
    //validar que no esten logueados dos usurios
    //evaluar el tiempo de generado que tiene el comprobante
    //recibir el usuario en el request

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