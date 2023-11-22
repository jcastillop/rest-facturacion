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
exports.rptCierreTurnos = exports.rptDeclaracionMensual = exports.rptProductoTurno = exports.rptProducto = void 0;
const comprobante_1 = require("../models/comprobante");
const rptProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.body;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteProductoCombustible)(fecha);
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptProducto = rptProducto;
const rptProductoTurno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha, turnos, usuarios } = req.body;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteProductoCombustibleTurno)(fecha, turnos, usuarios);
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptProductoTurno = rptProductoTurno;
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
const rptCierreTurnos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha } = req.body;
    const { hasError, message, data } = yield (0, comprobante_1.generaReporteCierreTurno)(fecha);
    res.json({
        hasError: hasError,
        message: message,
        data: data
    });
});
exports.rptCierreTurnos = rptCierreTurnos;
//# sourceMappingURL=reportes.js.map