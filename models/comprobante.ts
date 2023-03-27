import { DataTypes, IntegerDataType, Sequelize } from "sequelize";
import { Sqlcn } from '../database/config';
import { numbersToLetters } from "../helpers/numeros-letras";
import Abastecimiento from "./abastecimiento";
import Item from "./item";

  
export const nuevoComprobante = async (idAbastecimiento: string, tipo:string, correlativo: string): Promise<any> => {

    const abastecimiento: any = await Abastecimiento.findByPk(idAbastecimiento);

    var valor_unitario = (parseFloat(abastecimiento.precioUnitario)/1.18).toFixed(10);
    var igv_unitario =(parseFloat(valor_unitario) * 0.18).toFixed(2);
    var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);

    const comprobante = Comprobante.build({ 
        tipo_comprobante: tipo,
        numeracion_documento_afectado: correlativo,
        total_gravadas: total_gravadas,
        total_igv:igv_unitario,
        total_venta:abastecimiento.valorTotal,
        monto_letras:numbersToLetters(abastecimiento.valorTotal),
        Items:[{
            cantidad: abastecimiento.volTotal,
            valor_unitario: valor_unitario,
            precio_unitario: abastecimiento.precioUnitario,
            igv:igv_unitario,
            descripcion:'GLP',
            codigo_producto:'07',
            placa:'4298-PA',
        }]
    }, {
        include: [{
            model: Item,
            as: 'Items'
        }]
      });

    await comprobante.save();

    return comprobante;
}

export const Comprobante  = Sqlcn.define('Comprobantes', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipo_comprobante:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_emision:{
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },   
    tipo_moneda:{
        type: DataTypes.STRING,
        defaultValue: 'PEN'
    },  
    tipo_operacion:{
        type: DataTypes.STRING,
        defaultValue: '0101'
    },  
    tipo_nota:{
        type: DataTypes.STRING,
        allowNull: true
    }, 
    tipo_documento_afectado:{
        type: DataTypes.STRING,
        allowNull: true     
    },
    numeracion_documento_afectado:{
        type: DataTypes.STRING,
        allowNull: true
    },
    motivo_documento_afectado:{
        type: DataTypes.STRING,
        allowNull: true
    },
    total_gravadas:{
        type: DataTypes.STRING
    },       
    total_igv:{
        type: DataTypes.STRING
    },
    total_venta:{
        type: DataTypes.STRING
    },  
    monto_letras:{
        type: DataTypes.STRING
    },                                                      
});
Comprobante.hasMany(Item, {
    foreignKey: 'ComprobanteId'
});


(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
