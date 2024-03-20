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
exports.rptCierreTurnos = exports.rptComprobantes = exports.rptDeclaracionMensual = exports.rptProductoTurnoTotalizados = exports.rptProductoTurno = exports.rptDiarioRangos = void 0;
const comprobante_1 = require("../models/comprobante");
const rptDiarioRangos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha_inicio, fecha_fin } = req.body;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteDiarioRangos)(fecha_inicio, fecha_fin);
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptDiarioRangos = rptDiarioRangos;
const rptProductoTurno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.query;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteProductoCombustibleTurno)((fecha === null || fecha === void 0 ? void 0 : fecha.toString()) || "");
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptProductoTurno = rptProductoTurno;
const rptProductoTurnoTotalizados = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha, turnos, usuarios } = req.body;
    const [combustible_turno, combustible_turno_totalizado] = yield Promise.all([
        (0, comprobante_1.generaReporteProductoCombustibleTurnoExcel)(fecha, turnos, usuarios),
        (0, comprobante_1.generaReporteProductoCombustibleTurnoTotalizadoExcel)(fecha, turnos, usuarios)
    ]);
    //const { hasError, message, data } = await generaReporteProductoCombustibleTurnoExcel(fecha, turnos, usuarios);
    res.json({
        hasError: combustible_turno.hasError && combustible_turno_totalizado.hasError,
        message: combustible_turno.message,
        data: {
            turnos: combustible_turno.data,
            totales: combustible_turno_totalizado.data
        }
    });
});
exports.rptProductoTurnoTotalizados = rptProductoTurnoTotalizados;
const rptDeclaracionMensual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month, year } = req.body;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteDeclaracionMensual)(month, year);
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptDeclaracionMensual = rptDeclaracionMensual;
const rptComprobantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha, usuario, ruc, tipo_comprobante } = req.body;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteComprobantes)(fecha, usuario, ruc, tipo_comprobante);
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptComprobantes = rptComprobantes;
const rptCierreTurnos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.query;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteCierreTurno)((fecha === null || fecha === void 0 ? void 0 : fecha.toString()) || "");
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptCierreTurnos = rptCierreTurnos;
//# sourceMappingURL=reportes.js.map