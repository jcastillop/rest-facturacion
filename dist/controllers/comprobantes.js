"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.listaTurnosPorCerrar = exports.createCierreDia = exports.cierreTurno = exports.historicoComprobantes = exports.generaComprobante = void 0;
const receptor_1 = __importStar(require("../models/receptor"));
const abastecimiento_1 = require("../models/abastecimiento");
const comprobante_1 = require("../models/comprobante");
const correlativo_1 = require("../models/correlativo");
const cierreturno_1 = __importStar(require("../models/cierreturno"));
const api_mifact_1 = require("../helpers/api-mifact");
const constantes_1 = __importDefault(require("../helpers/constantes"));
const sequelize_1 = require("sequelize");
const cierredia_1 = require("../models/cierredia");
const usuario_1 = __importDefault(require("../models/usuario"));
const generaComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const serie = '001';
    const bCreateOrderMiFact = (body.tipo == constantes_1.default.TipoComprobante.Boleta || body.tipo == constantes_1.default.TipoComprobante.Factura || body.tipo == constantes_1.default.TipoComprobante.NotaCredito);
    var responseMiFact;
    const { hasErrorCorrelativo, messageCorrelativo, correlativo } = yield (0, correlativo_1.generaCorrelativo)(body.tipo, serie);
    if (hasErrorCorrelativo) {
        res.json({ hasError: true, respuesta: messageCorrelativo });
        return;
    }
    const { hasErrorReceptor, messageReceptor, receptor } = yield (0, receptor_1.obtieneReceptor)(body.numero_documento ? body.numero_documento : 0, body.tipo_documento, body.razon_social, body.direccion, body.correo, body.placa);
    if (hasErrorReceptor) {
        res.json({ hasError: true, respuesta: messageReceptor });
        return;
    }
    const { hasErrorComprobante, messageComprobante, comprobante } = yield (0, comprobante_1.nuevoComprobante)(body.id, body.tipo, receptor, correlativo, body.placa, body.usuario, body.producto, body.comentario, body.tipo_afectado, body.numeracion_afectado, body.fecha_afectado, body.tarjeta, body.efectivo, body.billete);
    if (hasErrorComprobante) {
        res.json({ hasError: true, respuesta: messageComprobante });
        return;
    }
    if (bCreateOrderMiFact) {
        const { hasErrorMiFact, messageMiFact, response } = yield (0, api_mifact_1.createOrderApiMiFact)(comprobante, receptor, body.tipo, correlativo);
        responseMiFact = response;
        if (hasErrorMiFact) {
            res.json({ hasError: true, respuesta: messageMiFact });
            return;
        }
    }
    const { hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate } = yield (0, comprobante_1.actualizarComprobante)(responseMiFact, comprobante.id, bCreateOrderMiFact);
    if (hasErrorActualizaComprobante) {
        res.json({ hasError: true, respuesta: messageActualizaComprobante });
        return;
    }
    const { hasErrorActualizaAbastecimiento, messageActualizaAbastecimiento } = yield (0, abastecimiento_1.actualizaAbastecimiento)(body.id);
    if (hasErrorActualizaAbastecimiento) {
        res.json({ hasError: true, respuesta: messageActualizaAbastecimiento });
        return;
    }
    res.json({
        hasError: false,
        receptor: receptor,
        comprobante: comprobanteUpdate,
        respuesta: bCreateOrderMiFact ? "Comprobante guardado y enviado a SUNAT" : "Comprobante generado"
    });
});
exports.generaComprobante = generaComprobante;
const historicoComprobantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const comprobanteParams = body;
    const queryAnd = [];
    var queryWhere = {};
    const usuario = yield usuario_1.default.findByPk(comprobanteParams.idUsuario, { raw: true });
    if (usuario.rol == 'ADMIN_ROLE') {
        queryAnd.push({ numeracion_comprobante: { [sequelize_1.Op.ne]: null } });
    }
    else if (usuario.rol == 'USER_ROLE') {
        queryAnd.push({ UsuarioId: comprobanteParams.idUsuario });
        queryAnd.push({ CierreturnoId: null });
    }
    else {
        queryAnd.push({ CierreturnoId: { [sequelize_1.Op.ne]: null } });
    }
    queryWhere = { [sequelize_1.Op.and]: queryAnd };
    const queryParams = {
        include: [
            { model: receptor_1.default, required: true },
            { model: cierreturno_1.default, required: false },
            { model: usuario_1.default, required: true }
        ],
        where: queryWhere,
        offset: Number(comprobanteParams.offset),
        limit: Number(comprobanteParams.limit),
        raw: true
    };
    const data = yield comprobante_1.Comprobante.findAndCountAll(queryParams);
    res.json({
        total: data.count,
        comprobantes: data.rows
    });
});
exports.historicoComprobantes = historicoComprobantes;
const cierreTurno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const cierre = yield (0, cierreturno_1.cerrarTurno)({ sessionID: body.session, fecha: body.fecha, turno: body.turno, isla: body.isla, efectivo: body.efectivo, tarjeta: body.tarjeta });
        res.json({
            cierre
        });
    }
    catch (error) {
        res.json({
            error
        });
    }
});
exports.cierreTurno = cierreTurno;
const createCierreDia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const cierre = yield (0, cierredia_1.cerrarDia)({ sessionID: body.session, fecha: body.fecha });
        res.json({
            cierre
        });
    }
    catch (error) {
        res.json({
            error
        });
    }
});
exports.createCierreDia = createCierreDia;
const listaTurnosPorCerrar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const cierre = yield (0, cierreturno_1.obtenerCierreTurno)({ fecha: body.fecha });
        res.json(cierre);
    }
    catch (error) {
        res.json({
            error
        });
    }
});
exports.listaTurnosPorCerrar = listaTurnosPorCerrar;
//# sourceMappingURL=comprobantes.js.map