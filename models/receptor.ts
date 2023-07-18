import { DataTypes, Model, Op } from "sequelize";
import { Sqlcn } from '../database/config';
import { Comprobante } from "./comprobante";

export const obtieneReceptor = async (numero_documento: string, tipo_documento: string, razon_social: string, direccion: string, correo: string) => {
    const [receptor, created] = await Receptor.findOrCreate({
        where: { numero_documento: numero_documento },
        defaults: {
            tipo_documento: tipo_documento,
            razon_social: razon_social,
            direccion: direccion,
            correo: correo
        }
      });
      return receptor;
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
}, {
    timestamps: false
});

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();


export default Receptor;