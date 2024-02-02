import { DataTypes, QueryTypes } from "sequelize";
import { Sqlcn } from '../database/config';
import { Comprobante } from "./comprobante";
import Usuario from "./usuario";
import { getTodayDate } from "../helpers/date-values";
import { log4js } from "../helpers";
import { ICierreturno } from "../interfaces/cierreturno";
import Gastos from "./gastos";
import Depositos from "./depositos";

interface PropsCerrarTurno{
    cierre?: ICierreturno,
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
    log4js( "Inicio cerrarTurno");

    log4js( `Inicio cerrarTurno: sessionID ${sessionID},  turno ${turno},  isla ${isla},  total ${efectivo + tarjeta + yape}, efectivo ${efectivo},  tarjeta ${tarjeta},  yape ${yape}` );
    const totalSumado = (Math.round((efectivo + tarjeta + yape) * 100) / 100).toFixed(2);
    try {
        const cierre: any = Cierreturno.build({
            UsuarioId: sessionID,
            total: totalSumado,
            turno: turno,
            isla: isla,
            fecha: getTodayDate(),
            efectivo: efectivo.toFixed(2),
            tarjeta: tarjeta.toFixed(2),
            yape: yape.toFixed(2)
        });
        log4js( "Procesando cerrarTurno" + cierre);
    
        await cierre.save();
    
        const respUpdate = await Comprobante.update({ CierreturnoId: cierre.id },{where:{UsuarioId: sessionID, CierreturnoId: null}});
        const respGatos = await Gastos.update({ CierreturnoId: cierre.id },{where:{UsuarioId: sessionID, CierreturnoId: null}});
        const respDepositos = await Depositos.update({ CierreturnoId: cierre.id },{where:{UsuarioId: sessionID, CierreturnoId: null}});
        log4js( "Fin cerrarTurno");
        return {
            cierre,
            cantidad: respUpdate[0]
        }        

    } catch (error: any) {
        log4js( "cerrarTurno: " + error.toString(), 'error');
        return {
            cantidad: 0
        }        
    }


}

export const obtenerCierreTurno = async(): Promise<any> =>{

    const data: any = await Cierreturno.findAll({ 
        include: [
            { model: Usuario, required: true }
        ],             
        where: { CierrediaId: null },
        order: [
            ['fecha', 'DESC'],
            ['turno', 'ASC'],
        ]
    });


    return data;
}

export const obtieneCierreTurnoGalonaje = async( usuario: string ):Promise<any> => {
    log4js( "Inicio obtieneCierreTurnoGalonaje ");
    var resultado
    //cambios
    await Sqlcn.query(
        'select dec_combustible as producto, sum(CASE when tipo_comprobante in (\'01\',\'03\',\'52\') then volumen else 0 END) as total_galones, sum(CASE when tipo_comprobante = \'50\' then volumen else 0 END) as despacho_galones, sum(CASE when tipo_comprobante = \'51\' then volumen else 0 END) as calibracion_galones, sum(CASE when tipo_comprobante in (\'01\',\'03\',\'52\') then CONVERT(float, total_venta) else 0 END) as total_soles, sum(CASE when tipo_comprobante = \'50\' then CONVERT(float, total_venta) else 0 END) as despacho_soles, sum(CASE when tipo_comprobante = \'51\' then CONVERT(float, total_venta) else 0 END) as calibracion_soles from Comprobantes where CierreturnoId is null and UsuarioId = :usuario group by dec_combustible;', 
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
        'select dec_combustible as producto, sum(CASE when tipo_comprobante in (\'01\',\'03\',\'52\') then CONVERT(float, total_venta) else 0 END) as total, sum(CASE when tipo_comprobante = \'50\' then CONVERT(float, total_venta) else 0 END) as despacho, sum(CASE when tipo_comprobante = \'51\' then CONVERT(float, total_venta) else 0 END) as calibracion from Comprobantes where CierreturnoId is null and UsuarioId = :usuario group by dec_combustible;', 
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
        'select sum(pago_efectivo) as efectivo, sum(pago_tarjeta) as tarjeta, sum(pago_yape) as yape from Comprobantes where CierreturnoId is null and tipo_comprobante in (\'01\',\'03\',\'52\') and UsuarioId = :usuario ', 
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
