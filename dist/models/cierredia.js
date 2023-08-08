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
exports.cerrarDia = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const cierreturno_1 = __importDefault(require("./cierreturno"));
const cerrarDia = ({ sessionID, fecha }) => __awaiter(void 0, void 0, void 0, function* () {
    var montoCierre = 0;
    yield config_1.Sqlcn.query('SELECT ROUND(SUM(CONVERT(float,total)),2) as suma from Cierreturnos where CierrediaId is null', {
        replacements: { sessionID },
        type: sequelize_1.QueryTypes.SELECT,
        plain: true
    }).then((results) => {
        console.log(results);
        montoCierre = results.suma;
    });
    const cierre = Cierredia.build({
        UsuarioId: sessionID,
        fecha: fecha,
        total: montoCierre
    });
    yield cierre.save();
    const updateRow = yield cierreturno_1.default.update({ CierrediaId: cierre.id }, { where: { CierrediaId: null } });
    return {
        transactionOk: updateRow ? true : false
    };
});
exports.cerrarDia = cerrarDia;
const Cierredia = config_1.Sqlcn.define('Cierredias', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    total: {
        type: sequelize_1.DataTypes.FLOAT
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE
    },
    estado: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    },
}, {
    timestamps: false
});
exports.default = Cierredia;
//# sourceMappingURL=cierredia.js.map