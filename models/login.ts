import { DataTypes, IntegerDataType, Op, Sequelize } from "sequelize";
import { Sqlcn } from '../database/config';
import { log4js } from "../helpers";
import Usuario from "./usuario";

export const nuevoLogin = async (user: string, password:string, terminal: string, isla: string, jornada: string, ip: string, fecha_registro: Date): Promise<any> => {
    try {
        const usuario : any = await Usuario.findOne({attributes: ["id","usuario","nombre","correo","rol"], where: {[Op.and]: [{ usuario: user },{ password: password }]}});
        
        if(usuario){
            const login = Login.build({
                UsuarioId: usuario.id,
                terminal: terminal,
                isla: isla,
                jornada: jornada,
                ip: ip,
                fecha_registro: fecha_registro,
            },{
                include: [
                    { model: Usuario }
                ]
            });
            await login.save();
            return {usuario, login};        
        }        
    } catch (error) {
        console.log(error);
        log4js( error, 'error');
        return null;
    }

    return null;
}

const Login  = Sqlcn.define('Logins', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },   
    terminal:{
        type: DataTypes.STRING,
        allowNull: false
    },
    isla:{
        type: DataTypes.STRING,
        allowNull: false
    },  
    jornada:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['TURNO1', 'TURNO2', 'TURNO3']]
        }        
    },
    ip:{
        type: DataTypes.STRING,
        allowNull: false
    },    
    fecha_registro:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },                                                        
}, {
    timestamps: false
});

export default Login;