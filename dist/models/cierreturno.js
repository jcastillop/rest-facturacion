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
exports.obtenerCierreTurno = exports.cerrarTurno = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const comprobante_1 = require("./comprobante");
const usuario_1 = __importDefault(require("./usuario"));
const cerrarTurno = ({ sessionID, fecha, turno, isla, efectivo, tarjeta, yape }) => __awaiter(void 0, void 0, void 0, function* () {
    var montoCierre = 0;
    yield config_1.Sqlcn.query('SELECT ROUND(SUM(CONVERT(float,total_venta)),2) as suma from Comprobantes where UsuarioId=:sessionID and CierreturnoId is null;', {
        replacements: { sessionID },
        type: sequelize_1.QueryTypes.SELECT,
        plain: true
    }).then((results) => {
        montoCierre = results.suma;
    });
    const cierre = Cierreturno.build({
        UsuarioId: sessionID,
        fecha: fecha,
        total: montoCierre ? montoCierre : 0,
        turno: turno,
        isla: isla,
        efectivo: efectivo,
        tarjeta: tarjeta,
        yape: yape
    });
    yield cierre.save();
    const updateRow = yield comprobante_1.Comprobante.update({ CierreturnoId: cierre.id }, { where: { UsuarioId: sessionID, CierreturnoId: null } });
    return {
        transactionOk: updateRow ? true : false
    };
});
exports.cerrarTurno = cerrarTurno;
const obtenerCierreTurno = ({ fecha }) => __awaiter(void 0, void 0, void 0, function* () {
    /*
      const isla: any = await Isla.findAll({
        include: [
            {
                model: Pistola,
                as: 'Pistolas'
            }
        ],
        where:{
            [Op.and]: [{ ip: remoteAddress },{ estado: 1 }]
        },
    });
    */
    const data = yield Cierreturno.findAll({
        include: [
            { model: usuario_1.default, required: true }
        ],
        where: { fecha: fecha, CierrediaId: null }
    });
    return data;
});
exports.obtenerCierreTurno = obtenerCierreTurno;
const Cierreturno = config_1.Sqlcn.define('Cierreturnos', {
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
    turno: {
        type: sequelize_1.DataTypes.STRING
    },
    isla: {
        type: sequelize_1.DataTypes.STRING
    },
    efectivo: {
        type: sequelize_1.DataTypes.FLOAT
    },
    tarjeta: {
        type: sequelize_1.DataTypes.FLOAT
    },
    yape: {
        type: sequelize_1.DataTypes.FLOAT
    },
    estado: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    },
}, {
    timestamps: false
});
exports.default = Cierreturno;
//# sourceMappingURL=cierreturno.js.map