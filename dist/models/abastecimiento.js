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
exports.actualizaAbastecimiento = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const actualizaAbastecimiento = (idAbastecimiento) => __awaiter(void 0, void 0, void 0, function* () {
    const updateRow = yield Abastecimiento.update({ estado: 1 }, { where: { idAbastecimiento: idAbastecimiento } });
    return updateRow;
});
exports.actualizaAbastecimiento = actualizaAbastecimiento;
const Abastecimiento = config_1.ControladorSQL.define('Abastecimientos', {
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
    estado: {
        type: sequelize_1.DataTypes.TINYINT
    },
}, {
    timestamps: false
});
exports.default = Abastecimiento;
//# sourceMappingURL=abastecimiento.js.map