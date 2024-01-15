import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

const Depositos  = Sqlcn.define('Depositos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },   
    concepto:{
        type: DataTypes.STRING,
        allowNull: true
    },
    monto:{
        type: DataTypes.FLOAT
    },    
    usuario:{
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

export default Depositos;

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
