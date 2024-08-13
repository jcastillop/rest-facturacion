import { DataTypes, IntegerDataType, Op, QueryTypes, Sequelize } from "sequelize";
import { Sqlcn } from '../database/config';
import { log4js } from "../helpers";

export const obtenerDescuentos = async () => {
    log4js("Inicio obtenerDescuentos ");

    try {
        var data;
        var query =
            'select d.id, d.codigo_producto, p.nombre as nombre_producto, d.numero_documento, r.razon_social as nombre_cliente, d.monto_descuento, d.fecha ' +
            'from Descuentos d ' +
            'left join Receptores r on d.numero_documento = r.numero_documento ' +
            'inner join Productos p on d.codigo_producto = p.codigo';

        await Sqlcn.query(query, { type: QueryTypes.SELECT }).then((results: any) => {
                data = results
            });
        log4js("Fin obtenerDescuentos ");

        return {
            hasError: false,
            message: "Consulta descuentos realizada satisfactoriamente",
            data
        };
    } catch (error: any) {
        log4js("obtenerDescuentos: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "obtenerDescuentos: " + error.toString()
        };
    }
}

export const Descuentos  = Sqlcn.define('Descuentos', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },   
    codigo_producto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_documento:{
        type: DataTypes.STRING,
        allowNull: false
    },    
    monto_descuento:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    tipo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: true,
    },     
}, {
    timestamps: false
});

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
