import { DataTypes, IntegerDataType, Sequelize } from "sequelize";
import { Sqlcn } from '../database/config';
import { numbersToLetters } from "../helpers/numeros-letras";
import Abastecimiento from "./abastecimiento";
import Item from "./item";
import Receptor from './receptor';
import Usuario from "./usuario";
import { PropsMiFact } from "../helpers/api-mifact";


export const nuevoComprobante = async (idAbastecimiento: string, tipo:string, receptor:any, correlativo: string, placa: string, usuario: number): Promise<any> => {

    const abastecimiento: any = await Abastecimiento.findByPk(idAbastecimiento);

    var valor_unitario = (parseFloat(abastecimiento.precioUnitario)/1.18).toFixed(10);
    var igv_unitario =((parseFloat(valor_unitario)*parseFloat(abastecimiento.volTotal))*0.18).toFixed(2);
    var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);

    const comprobante = Comprobante.build({ 
        ReceptorId: receptor.id,
        UsuarioId: usuario,
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
            codigo_producto:abastecimiento.codigoCombustible,
            placa: placa,
        }]
    }, {
        include: [
            { model: Item, as: 'Items' }
        ]
      });

    await comprobante.save();

    return comprobante;
}

export const actualizarComprobante = async (props: PropsMiFact, idComprobante: number): Promise<any> => {


        const data = await Comprobante.update(
            {
                cadena_para_codigo_qr: props.response.cadena_para_codigo_qr,
                codigo_hash: props.response.codigo_hash,
                pdf_bytes: props.response.pdf_bytes,
                url: props.response.url,
                errors: props.response.errors,
            },
            {
                where: { id: idComprobante },
                returning: true      
            }
        );

        if(data){
            return data[1][0];
        }

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
    cadena_para_codigo_qr:{
        type: DataTypes.STRING
    }, 
    codigo_hash:{
        type: DataTypes.STRING
    }, 
    pdf_bytes:{
        type: DataTypes.STRING
    },
    url:{
        type: DataTypes.STRING
    },     
    errors:{
        type: DataTypes.STRING
    },                                                             
});
Comprobante.hasMany(Item, {
    foreignKey: 'ComprobanteId'
});
Receptor.hasMany(Comprobante, {
    foreignKey: 'ReceptorId'
});
Comprobante.belongsTo(Receptor, {
    foreignKey: 'ReceptorId'
});
Usuario.hasMany(Comprobante, {
    foreignKey: 'UsuarioId'
});



(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
