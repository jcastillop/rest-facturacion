import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

const Pistola  = Sqlcn.define('Pistolas', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo:{
        type: DataTypes.INTEGER,
        allowNull: false
    },    
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    codigo_producto:{
        type: DataTypes.STRING,
        allowNull: false
    },  
    desc_producto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING
    },         
    precio_producto:{
        type: DataTypes.FLOAT,
        defaultValue: 0
    },       
    estado:{
        type: DataTypes.TINYINT,
        defaultValue: 1
    },                     
}, {
    timestamps: false
});

export default Pistola;