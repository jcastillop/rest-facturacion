import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';
import { Comprobante } from "./comprobante";

const Usuario = Sqlcn.define('Usuarios', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },      
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    usuario:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },    
    correo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(64),
        allowNull: false
    },
    img:{
        type: DataTypes.BLOB,
    },
    rol:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['ADMIN_ROLE', 'USER_ROLE', 'SUPERV_ROLE']]
        }
    },
    grifo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    isla:{
        type: DataTypes.STRING,
        allowNull: false
    },
    jornada:{
        type: DataTypes.STRING,
        allowNull: false
    },            
    AplicationId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },          
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: false
});


(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
    //console.log("no")
  })();

  export default Usuario;