"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../database/config"));
const Abastecimiento = config_1.default.define('Abastecimientos', {
    idAbastecimiento: {
        type: sequelize_1.DataTypes.TINYINT,
        primaryKey: true
    },
    registro: {
        type: sequelize_1.DataTypes.TINYINT
    },
    pistola: {
        type: sequelize_1.DataTypes.TINYINT
    },
    codigoCombustible: {
        type: sequelize_1.DataTypes.TINYINT
    },
    numeroTanque: {
        type: sequelize_1.DataTypes.TINYINT
    },
    valorTotal: {
        type: sequelize_1.DataTypes.FLOAT
    },
    volTotal: {
        type: sequelize_1.DataTypes.FLOAT
    },
    precioUnitario: {
        type: sequelize_1.DataTypes.FLOAT
    },
    tiempo: {
        type: sequelize_1.DataTypes.TINYINT
    },
    fechaHora: {
        type: sequelize_1.DataTypes.DATE
    },
    totInicio: {
        type: sequelize_1.DataTypes.FLOAT
    },
    totFinal: {
        type: sequelize_1.DataTypes.FLOAT
    },
    IDoperador: {
        type: sequelize_1.DataTypes.STRING
    },
    IDcliente: {
        type: sequelize_1.DataTypes.STRING
    },
    volTanque: {
        type: sequelize_1.DataTypes.TINYINT
    },
}, {
    timestamps: false
});
exports.default = Abastecimiento;
//# sourceMappingURL=abastecimiento.js.map