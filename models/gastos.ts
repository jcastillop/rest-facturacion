import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

const Gastos  = Sqlcn.define('Gastos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },   
    concepto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    monto:{
        type: DataTypes.FLOAT
    },    
    usuario_gasto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    autorizado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    turno:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },     
}, {
    timestamps: false
});

export default Gastos;

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
