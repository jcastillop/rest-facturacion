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
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const item_1 = __importDefault(require("./item"));
const Comprobante = config_1.Sqlcn.define('Comprobantes', {
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
Comprobante.hasMany(item_1.default, {
    foreignKey: 'ComprobanteId'
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
exports.default = Comprobante;
//# sourceMappingURL=comprobante.js.map