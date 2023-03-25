import { DataTypes, Model } from "sequelize";
import { Sqlcn } from '../database/config';

const Item = Sqlcn.define('Items', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ComprobanteId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },    
    cantidad:{
        type: DataTypes.STRING,
        allowNull: false
    },
    valor_unitario:{
        type: DataTypes.STRING,
        allowNull: false,

    },       
    precio_unitario:{
        type: DataTypes.STRING,
        allowNull: false
    },   
    igv:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING
    },    
    codigo_producto:{
        type: DataTypes.STRING
    },   
    placa:{
        type: DataTypes.STRING
    },                                                                             
});

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();

export default Item;