import { DataTypes, Model, Op, QueryTypes } from "sequelize";
import { Sqlcn } from '../database/config';
import Cierreturno from "./cierreturno";

interface PropsCerrarTurno{
    transactionOk: boolean;
}
interface ParamsCerrarTurno{
    sessionID: number;
    fecha: Date;
}

export const cerrarDia = async({ sessionID, fecha }:ParamsCerrarTurno): Promise<PropsCerrarTurno> =>{

    var montoCierre = 0  
   
    await Sqlcn.query(
        'SELECT ROUND(SUM(CONVERT(float,total)),2) as suma from Cierreturnos where CierrediaId is null', 
        {
            replacements: { sessionID },
            type: QueryTypes.SELECT,
            plain: true
        }).then((results: any)=>{
            montoCierre= results.suma
        });
           
    const cierre: any = Cierredia.build({
        UsuarioId: sessionID,
        fecha: fecha,
        total: montoCierre
    });

    await cierre.save();

    const updateRow = await Cierreturno.update({ CierrediaId: cierre.id },{where:{CierrediaId: null}});

    return {
        transactionOk: updateRow?true:false
    }
}
const Cierredia= Sqlcn.define('Cierredias', {
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
    estado:{
        type: DataTypes.TINYINT,
        defaultValue: 1
    },    
}, {
    timestamps: false
});

export default Cierredia;