import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

const Isla  = Sqlcn.define('Islas', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ip:{
        type: DataTypes.STRING,
        allowNull: true
    },    
    cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    estado:{
        type: DataTypes.TINYINT,
        defaultValue: 1
    },                        
}, {
    timestamps: false
});

export default Isla;