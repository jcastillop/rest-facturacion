"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Descuentos = exports.obtenerDescuentos = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const helpers_1 = require("../helpers");
const obtenerDescuentos = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio obtenerDescuentos ");
    try {
        var data;
        var query = 'select d.id, d.codigo_producto, p.nombre as nombre_producto, d.numero_documento, r.razon_social as nombre_cliente, d.monto_descuento, d.fecha ' +
            'from Descuentos d ' +
            'left join Receptores r on d.numero_documento = r.numero_documento ' +
            'inner join Productos p on d.codigo_producto = p.codigo';
        yield config_1.Sqlcn.query(query, { type: sequelize_1.QueryTypes.SELECT }).then((results) => {
            data = results;
        });
        (0, helpers_1.log4js)("Fin obtenerDescuentos ");
        return {
            hasError: false,
            message: "Consulta descuentos realizada satisfactoriamente",
            data
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("obtenerDescuentos: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "obtenerDescuentos: " + error.toString()
        };
    }
});
exports.obtenerDescuentos = obtenerDescuentos;
exports.Descuentos = config_1.Sqlcn.define('Descuentos', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo_producto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    numero_documento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    monto_descuento: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: false
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
//# sourceMappingURL=descuentos.js.map