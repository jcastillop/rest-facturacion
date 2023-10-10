import { DataTypes } from "sequelize";
import { ControladorSQL } from '../database/config';
import { log4js } from "../helpers";
import Constantes from "../helpers/constantes";



export const actualizaAbastecimiento = async (idAbastecimiento: string, tipo_comprobante: string): Promise<any> => {

    if(tipo_comprobante == Constantes.TipoComprobante.NotaCredito){
        log4js( "Fin actualizaAbastecimiento ");
        return {
            hasErrorActualizaAbastecimiento: false,
            messageActualizaAbastecimiento: `No se valida abastecimiento para NC`
        };        
    }else{
        try {
            const abastecimento = await Abastecimiento.update({estado:1},{where:{idAbastecimiento: idAbastecimiento}});
            if(abastecimento){
                return {
                    hasErrorActualizaAbastecimiento: false,
                    messageActualizaAbastecimiento: `Abastecimiento actualizado correctamente`
                };
            }else{
                return {
                    hasErrorActualizaAbastecimiento: true,
                    messageActualizaAbastecimiento: `No se actualizó ningún registro`
                };
            } 
        } catch (error: any) {
            log4js( "actualizaAbastecimiento: " + error.toString(), 'error');
            return {
                hasErrorActualizaAbastecimiento: true,
                messageActualizaAbastecimiento: error.toString(),
            };
        }        
    }
}

const Abastecimiento = ControladorSQL.define('Abastecimientos', {
    idAbastecimiento:{
        type: DataTypes.TINYINT,
        primaryKey: true
    },
    registro:{
        type: DataTypes.TINYINT
    },
    pistola:{
        type: DataTypes.TINYINT
    },   
    codigoCombustible:{
        type: DataTypes.TINYINT
    },  
    numeroTanque:{
        type: DataTypes.TINYINT
    },  
    valorTotal:{
        type: DataTypes.FLOAT
    },  
    volTotal:{
        type: DataTypes.FLOAT
    },  
    precioUnitario:{
        type: DataTypes.FLOAT
    },  
    tiempo:{
        type: DataTypes.TINYINT
    },  
    fechaHora:{
        type: DataTypes.DATE
    },
    totInicio:{
        type: DataTypes.FLOAT
    }, 
    totFinal:{
        type: DataTypes.FLOAT
    },   
    IDoperador:{
        type: DataTypes.STRING
    },  
    IDcliente:{
        type: DataTypes.STRING
    },  
    volTanque:{
        type: DataTypes.TINYINT
    },     
    estado:{
        type: DataTypes.TINYINT
    },                             
}, {
    timestamps: false
});

export default Abastecimiento;