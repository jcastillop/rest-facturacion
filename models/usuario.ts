import { DataTypes } from "sequelize";
import { Sqlcn } from '../database/config';

export const validaUsuarios = async (usuario: string): Promise<any> =>{
    const data = await Usuario.findAll({
        where: { usuario: usuario}
    })
    if(data.length > 0){
        return false;
    }else{
        return true;
    }
}
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
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: false
});

export default Usuario;

