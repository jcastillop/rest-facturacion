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
exports.obtieneCierreTurnoTotalSoles = exports.obtieneCierreTurnoTotalProducto = exports.obtieneCierreTurnoGalonaje = exports.obtenerCierreTurno = exports.cerrarTurno = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const comprobante_1 = require("./comprobante");
const usuario_1 = __importDefault(require("./usuario"));
const date_values_1 = require("../helpers/date-values");
const helpers_1 = require("../helpers");
const gastos_1 = __importDefault(require("./gastos"));
const depositos_1 = __importDefault(require("./depositos"));
const cerrarTurno = ({ sessionID, turno, isla, efectivo, tarjeta, yape }) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio cerrarTurno");
    (0, helpers_1.log4js)(`Inicio cerrarTurno: sessionID ${sessionID},  turno ${turno},  isla ${isla},  total ${efectivo + tarjeta + yape}, efectivo ${efectivo},  tarjeta ${tarjeta},  yape ${yape}`);
    const totalSumado = (Math.round((efectivo + tarjeta + yape) * 100) / 100).toFixed(2);
    try {
        const cierre = Cierreturno.build({
            UsuarioId: sessionID,
            total: totalSumado,
            turno: turno,
            isla: isla,
            fecha: (0, date_values_1.getTodayDate)(),
            efectivo: efectivo.toFixed(2),
            tarjeta: tarjeta.toFixed(2),
            yape: yape.toFixed(2)
        });
        (0, helpers_1.log4js)("Procesando cerrarTurno" + cierre);
        yield cierre.save();
        const respUpdate = yield comprobante_1.Comprobante.update({ CierreturnoId: cierre.id }, { where: { UsuarioId: sessionID, CierreturnoId: null } });
        const respGatos = yield gastos_1.default.update({ CierreturnoId: cierre.id }, { where: { UsuarioId: sessionID, CierreturnoId: null } });
        const respDepositos = yield depositos_1.default.update({ CierreturnoId: cierre.id }, { where: { UsuarioId: sessionID, CierreturnoId: null } });
        (0, helpers_1.log4js)("Fin cerrarTurno");
        return {
            cierre,
            cantidad: respUpdate[0]
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("cerrarTurno: " + error.toString(), 'error');
        return {
            cantidad: 0
        };
    }
});
exports.cerrarTurno = cerrarTurno;
const obtenerCierreTurno = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Cierreturno.findAll({
        include: [
            { model: usuario_1.default, required: true }
        ],
        where: { CierrediaId: null },
        order: [
            ['fecha', 'DESC'],
            ['turno', 'ASC'],
        ]
    });
    return data;
});
exports.obtenerCierreTurno = obtenerCierreTurno;
const obtieneCierreTurnoGalonaje = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio obtieneCierreTurnoGalonaje ");
    var resultado;
    //cambios
    yield config_1.Sqlcn.query('select dec_combustible as producto, sum(CASE when tipo_comprobante in (\'01\',\'03\',\'52\') then volumen else 0 END) as total_galones, sum(CASE when tipo_comprobante = \'50\' then volumen else 0 END) as despacho_galones, sum(CASE when tipo_comprobante = \'51\' then volumen else 0 END) as calibracion_galones, sum(CASE when tipo_comprobante in (\'01\',\'03\',\'52\') then CONVERT(float, total_venta) else 0 END) as total_soles, sum(CASE when tipo_comprobante = \'50\' then CONVERT(float, total_venta) else 0 END) as despacho_soles, sum(CASE when tipo_comprobante = \'51\' then CONVERT(float, total_venta) else 0 END) as calibracion_soles from Comprobantes where CierreturnoId is null and UsuarioId = :usuario and codigo_combustible <> \'\' group by dec_combustible;', {
        replacements: { usuario },
        type: sequelize_1.QueryTypes.SELECT,
        plain: false,
        raw: false
    }).then((results) => {
        resultado = results;
    });
    (0, helpers_1.log4js)("Fin obtieneCierreTurnoGalonaje");
    return resultado;
});
exports.obtieneCierreTurnoGalonaje = obtieneCierreTurnoGalonaje;
const obtieneCierreTurnoTotalProducto = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio obtieneCierreTurnoTotalProducto ");
    var resultado;
    var querySelect = 'select descripcion as producto, ' +
        'sum(convert(float, CASE when c.tipo_comprobante in (\'01\',\'03\',\'52\') then i.cantidad else \'0\' end)) as total_galones, ' +
        'sum(convert(float, CASE when c.tipo_comprobante = \'50\' then i.cantidad else \'0\' END)) as despacho_galones, ' +
        'sum(convert(float, CASE when c.tipo_comprobante = \'51\' then i.cantidad else \'0\' END)) as calibracion_galones, ' +
        'sum(convert(float, CASE when c.tipo_comprobante in (\'01\',\'03\',\'52\') then i.total_unitario else \'0\' end)) as total_soles, ' +
        'sum(convert(float, CASE when c.tipo_comprobante = \'50\' then i.total_unitario else \'0\' END)) as despacho_soles, ' +
        'sum(convert(float, CASE when c.tipo_comprobante = \'51\' then i.total_unitario else \'0\' END)) as calibracion_soles ' +
        'from items i ' +
        'inner join Comprobantes c on c.id = i.ComprobanteId ' +
        'where medida <> \'GLL\' and CierreturnoId is null and UsuarioId = :usuario ' +
        'group by i.descripcion;';
    yield config_1.Sqlcn.query(querySelect, {
        replacements: { usuario },
        type: sequelize_1.QueryTypes.SELECT,
        plain: false,
        raw: false
    }).then((results) => {
        resultado = results;
    });
    (0, helpers_1.log4js)("Fin obtieneCierreTurnoTotalProducto");
    return resultado;
});
exports.obtieneCierreTurnoTotalProducto = obtieneCierreTurnoTotalProducto;
const obtieneCierreTurnoTotalSoles = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio obtieneCierreTurnoTotalSoles");
    var resultado;
    yield config_1.Sqlcn.query('select sum(pago_efectivo) as efectivo, sum(pago_tarjeta) as tarjeta, sum(pago_yape) as yape from Comprobantes where CierreturnoId is null and tipo_comprobante in (\'01\',\'03\',\'52\') and UsuarioId = :usuario ', {
        replacements: { usuario },
        type: sequelize_1.QueryTypes.SELECT,
        plain: true,
        raw: false
    }).then((results) => {
        resultado = results;
    });
    (0, helpers_1.log4js)("Fin obtieneCierreTurnoTotalSoles ");
    return resultado;
});
exports.obtieneCierreTurnoTotalSoles = obtieneCierreTurnoTotalSoles;
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
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
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