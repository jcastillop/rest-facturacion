import { DataTypes, Model, Op } from "sequelize";
import { Sqlcn } from '../database/config';
import { log4js } from "../helpers";

export const obtieneReceptor = async (numero_documento: string, tipo_documento: string, razon_social: string, direccion: string, correo: string, placa: string) => {
    log4js( "Inicio obtieneReceptor");
    try {
        const [receptor, created] = await Receptor.findOrCreate({
            where: { numero_documento: numero_documento },
            defaults: {
                tipo_documento: tipo_documento,
                razon_social: razon_social,
                direccion: direccion,
                correo: correo,
                placa: placa,
            }        
        // const [receptor, created] = await Receptor.upsert({
        //     where: { numero_documento: numero_documento },
        //     defaults: {
        //         tipo_documento: tipo_documento,
        //         razon_social: razon_social,
        //         direccion: direccion,
        //         correo: correo,
        //         placa: placa,
        //     }
          });
        log4js( "Fin obtieneReceptor" + receptor);
        return {
            hasErrorReceptor: false,
            messageReceptor: `Receptor ${created? "creado":"actualizado"} correctamente`,
            receptor: receptor
        };
    } catch (error: any) {
        log4js( "obtieneReceptor: " + error.toString(), 'error');
        log4js( "Fin obtieneReceptor");
        return {
            hasErrorReceptor: true,
            messageReceptor: "obtieneReceptor: " + error.toString(),
        };
    }
}

const Receptor = Sqlcn.define('Receptores', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },    
    numero_documento:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    tipo_documento:{
        type: DataTypes.STRING,
        allowNull: false
    },    
    razon_social:{
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion:{
        type: DataTypes.STRING,
        allowNull: true,
    },                                                                  
    correo:{
        type: DataTypes.STRING,
        allowNull: true,

    },    
    placa:{
        type: DataTypes.STRING,
        allowNull: true,

    },      
}, {
    timestamps: false
});

export default Receptor;