import { DataTypes, QueryTypes } from "sequelize";
import { Sqlcn } from '../database/config';
import { Comprobante } from "./comprobante";
import Cierredia from './cierredia';
import Usuario from "./usuario";
import { getTodayDate } from "../helpers/date-values";
import { log4js } from "../helpers";
import { ICierreturno } from "../interfaces/cierreturno";

interface PropsCerrarTurno{
    cierre: ICierreturno,
    cantidad: number
}
interface ParamsCerrarTurno{
    sessionID: number;
    turno: string;
    isla: string;
    efectivo: number;
    tarjeta: number;
    yape: number;
}
interface ParamsListaCerrarTurno{
    fecha: Date;
}
interface ICierreTurnoReporteTotales {
    producto: string;
    total: number;
    despacho?: number;
    calibracion?: number;
}

export const cerrarTurno = async({ sessionID, turno, isla, efectivo, tarjeta, yape }:ParamsCerrarTurno): Promise<PropsCerrarTurno> =>{

    const cierre: any = Cierreturno.build({
        UsuarioId: sessionID,
        total: efectivo + tarjeta + yape,
        turno: turno,
        isla: isla,
        fecha: getTodayDate(),
        efectivo: efectivo,
        tarjeta: tarjeta,
        yape: yape
    });

    await cierre.save();

    const respUpdate = await Comprobante.update({ CierreturnoId: cierre.id },{where:{UsuarioId: sessionID, CierreturnoId: null}});

    return {
        cierre,
        cantidad: respUpdate[0]
    }
}

export const obtenerCierreTurno = async({ fecha }:ParamsListaCerrarTurno): Promise<any> =>{

    const data: any = await Cierreturno.findAll({ 
        include: [
            { model: Usuario, required: true }
        ],             
        where: { fecha: fecha, CierrediaId: null }
    });


    return data;
}

export const obtieneCierreTurnoGalonaje = async( usuario: string ):Promise<any> => {
    log4js( "Inicio obtieneCierreTurnoGalonaje ");
    var resultado

    await Sqlcn.query(
        'select dec_combustible as producto, sum(CASE when tipo_comprobante in (\'01\',\'03\') then volumen else 0 END) as total, sum(CASE when tipo_comprobante = \'50\' then volumen else 0 END) as despacho, sum(CASE when tipo_comprobante = \'51\' then volumen else 0 END) as calibracion from Comprobantes where CierreturnoId is null and UsuarioId = :usuario group by dec_combustible;', 
        {
            replacements: { usuario },
            type: QueryTypes.SELECT,
            plain: false,
            raw: false
        }).then((results: any)=>{
            resultado= results
        });  
    log4js( "Fin obtieneCierreTurnoGalonaje");
    return resultado  
}

export const obtieneCierreTurnoTotalProducto = async( usuario: string ):Promise<any> => {
    log4js( "Inicio obtieneCierreTurnoTotalProducto ");
    var resultado

    await Sqlcn.query(
        'select dec_combustible as producto, sum(CASE when tipo_comprobante in (\'01\',\'03\') then CONVERT(float, total_venta) else 0 END) as total, sum(CASE when tipo_comprobante = \'50\' then CONVERT(float, total_venta) else 0 END) as despacho, sum(CASE when tipo_comprobante = \'51\' then CONVERT(float, total_venta) else 0 END) as calibracion from Comprobantes where CierreturnoId is null and UsuarioId = :usuario group by dec_combustible;', 
        {
            replacements: { usuario },
            type: QueryTypes.SELECT,
            plain: false,
            raw: false
        }).then((results: any)=>{
            resultado= results
        });  
    log4js( "Fin obtieneCierreTurnoTotalProducto");
    return resultado  
}

export const obtieneCierreTurnoTotalSoles= async( usuario: string ):Promise<any> => {
    log4js( "Inicio obtieneCierreTurnoTotalSoles");
    var resultado

    await Sqlcn.query(
        'select sum(pago_efectivo) as efectivo, sum(pago_tarjeta) as tarjeta, sum(pago_yape) as yape from Comprobantes where CierreturnoId is null and tipo_comprobante in (\'01\',\'03\') and UsuarioId = :usuario ', 
        {
            replacements: { usuario },
            type: QueryTypes.SELECT,
            plain: true,
            raw: false
        }).then((results: any)=>{
            resultado= results
        });  
    log4js( "Fin obtieneCierreTurnoTotalSoles ");
    return resultado  
}

const Cierreturno = Sqlcn.define('Cierreturnos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },    
    total:{
        type: DataTypes.FLOAT
    },  
    fecha:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    turno:{
        type: DataTypes.STRING
    },
    isla:{
        type: DataTypes.STRING
    },
    efectivo:{
        type: DataTypes.FLOAT
    },
    tarjeta:{
        type: DataTypes.FLOAT
    },    
    yape:{
        type: DataTypes.FLOAT
    },       
    estado:{
        type: DataTypes.TINYINT,
        defaultValue: 1
    },  
}, {
    timestamps: false
});

export default Cierreturno;
