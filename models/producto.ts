import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

const Producto  = Sqlcn.define('Productos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },    
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    imagenes:{
        type: DataTypes.BLOB
    },  
    stock:{
        type: DataTypes.STRING,
        defaultValue: 0
    },
    codigo:{
        type: DataTypes.STRING,
    },    
    medida:{
        type: DataTypes.STRING,
        defaultValue: "NIU"
    },      
    precio:{
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    valor:{
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

export default Producto;