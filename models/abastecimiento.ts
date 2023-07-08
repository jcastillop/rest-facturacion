import { DataTypes } from "sequelize";
import { ControladorSQL } from '../database/config';

export const actualizaAbastecimiento = async (idAbastecimiento: string): Promise<any> => {
    const updateRow = await Abastecimiento.update({estado:1},{where:{idAbastecimiento: idAbastecimiento}});
    return updateRow;
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