import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';


const ReceptorPlaca = Sqlcn.define('ReceptoresPlacas', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },    
    fecha:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    placa:{
        type: DataTypes.STRING
    },      
    estado:{
        type: DataTypes.TINYINT,
        defaultValue: 1
    },  
}, {
    timestamps: false
});

export default ReceptorPlaca;