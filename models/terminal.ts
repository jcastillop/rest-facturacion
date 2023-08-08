import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

const Terminal  = Sqlcn.define('Terminales', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ubigeo:{
        type: DataTypes.STRING,
        allowNull: false
    },   
    direccion:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    estado:{
        type: DataTypes.TINYINT,
        defaultValue: 1
    },                         
}, {
    timestamps: false
});

export default Terminal;