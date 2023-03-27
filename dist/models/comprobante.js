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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comprobante = exports.nuevoComprobante = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const numeros_letras_1 = require("../helpers/numeros-letras");
const abastecimiento_1 = __importDefault(require("./abastecimiento"));
const item_1 = __importDefault(require("./item"));
const nuevoComprobante = (idAbastecimiento, tipo, correlativo) => __awaiter(void 0, void 0, void 0, function* () {
    const abastecimiento = yield abastecimiento_1.default.findByPk(idAbastecimiento);
    var valor_unitario = (parseFloat(abastecimiento.precioUnitario) / 1.18).toFixed(10);
    var igv_unitario = (parseFloat(valor_unitario) * 0.18).toFixed(2);
    var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);
    const comprobante = exports.Comprobante.build({
        tipo_comprobante: tipo,
        numeracion_documento_afectado: correlativo,
        total_gravadas: total_gravadas,
        total_igv: igv_unitario,
        total_venta: abastecimiento.valorTotal,
        monto_letras: (0, numeros_letras_1.numbersToLetters)(abastecimiento.valorTotal),
        Items: [{
                cantidad: abastecimiento.volTotal,
                valor_unitario: valor_unitario,
                precio_unitario: abastecimiento.precioUnitario,
                igv: igv_unitario,
                descripcion: 'GLP',
                codigo_producto: '07',
                placa: '4298-PA',
            }]
    }, {
        include: [{
                model: item_1.default,
                as: 'Items'
            }]
    });
    yield comprobante.save();
    return comprobante;
});
exports.nuevoComprobante = nuevoComprobante;
exports.Comprobante = config_1.Sqlcn.define('Comprobantes', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipo_comprobante: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    fecha_emision: {
        type: sequelize_1.DataTypes.DATEONLY,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    tipo_moneda: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'PEN'
    },
    tipo_operacion: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '0101'
    },
    tipo_nota: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipo_documento_afectado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    numeracion_documento_afectado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    motivo_documento_afectado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    total_gravadas: {
        type: sequelize_1.DataTypes.STRING
    },
    total_igv: {
        type: sequelize_1.DataTypes.STRING
    },
    total_venta: {
        type: sequelize_1.DataTypes.STRING
    },
    monto_letras: {
        type: sequelize_1.DataTypes.STRING
    },
});
exports.Comprobante.hasMany(item_1.default, {
    foreignKey: 'ComprobanteId'
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
//# sourceMappingURL=comprobante.js.map