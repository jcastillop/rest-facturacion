import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

const Emisor  = Sqlcn.define('Emisores', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },   
    ruc:{
        type: DataTypes.STRING('11'),
        allowNull: false
    },
    razon_social:{
        type: DataTypes.STRING,
        allowNull: false
    },   
    nombre_comercial:{
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
}, {
    timestamps: false
});

export default Emisor;

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
