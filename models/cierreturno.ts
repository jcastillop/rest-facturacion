import { DataTypes, QueryTypes } from "sequelize";
import { Sqlcn } from '../database/config';
import { Comprobante } from "./comprobante";
import Cierredia from './cierredia';
import Usuario from "./usuario";

interface PropsCerrarTurno{
    transactionOk: boolean;
}
interface ParamsCerrarTurno{
    sessionID: number;
    fecha: Date;
    turno: string;
    isla: string;
    efectivo: number;
    tarjeta: number;
    yape: number;
}
interface ParamsListaCerrarTurno{
    fecha: Date;
}

export const cerrarTurno = async({ sessionID, fecha, turno, isla, efectivo, tarjeta, yape }:ParamsCerrarTurno): Promise<PropsCerrarTurno> =>{

    var montoCierre = 0  
   
    await Sqlcn.query(
        'SELECT ROUND(SUM(CONVERT(float,total_venta)),2) as suma from Comprobantes where UsuarioId=:sessionID and CierreturnoId is null;', 
        {
            replacements: { sessionID },
            type: QueryTypes.SELECT,
            plain: true
        }).then((results: any)=>{
            montoCierre= results.suma
        });
           
    const cierre: any = Cierreturno.build({
        UsuarioId: sessionID,
        fecha: fecha,
        total: montoCierre?montoCierre:0,
        turno: turno,
        isla: isla,
        efectivo: efectivo,
        tarjeta: tarjeta,
        yape: yape
    });

    await cierre.save();

    const updateRow = await Comprobante.update({ CierreturnoId: cierre.id },{where:{UsuarioId: sessionID, CierreturnoId: null}});

    return {
        transactionOk: updateRow?true:false
    }
}

export const obtenerCierreTurno = async({ fecha }:ParamsListaCerrarTurno): Promise<any> =>{
    /*
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
    */

    const data: any = await Cierreturno.findAll({ 
        include: [
            { model: Usuario, required: true }
        ],             
        where: { fecha: fecha, CierrediaId: null }
    });


    return data;
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
        type: DataTypes.DATE
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
