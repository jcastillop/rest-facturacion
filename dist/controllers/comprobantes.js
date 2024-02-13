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
exports.getNotasDespacho = exports.getComprobante = exports.cierreTurnoTotalSoles = exports.cierreTurnoTotalProducto = exports.cierreTurnoGalonaje = exports.historicoCierres = exports.listaTurnosPorCerrar = exports.createCierreDia = exports.cierreTurno = exports.historicoComprobantes = exports.modificaComprobante = exports.generaComprobanteV2 = exports.generaComprobante = void 0;
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
    const { hasError, message } = yield (0, comprobante_1.validaComprobanteAbastecimiento)(body.id, body.tipo);
    if (hasError) {
        res.json({
            hasError: hasError,
            respuesta: message
        });
    }
    else {
        const { hasErrorCorrelativo, messageCorrelativo, correlativo } = yield (0, correlativo_1.generaCorrelativo)(body.tipo, serie, body.prefijo ? body.prefijo : "");
        if (hasErrorCorrelativo) {
            res.json({ hasError: true, respuesta: messageCorrelativo });
            return;
        }
        const { hasErrorReceptor, messageReceptor, receptor } = yield (0, receptor_1.obtieneReceptor)(body.numero_documento ? body.numero_documento : 0, body.tipo_documento, body.razon_social, body.direccion, body.correo, body.placa);
        if (hasErrorReceptor) {
            res.json({ hasError: true, respuesta: messageReceptor });
            return;
        }
        const { hasErrorComprobante, messageComprobante, comprobante } = yield (0, comprobante_1.nuevoComprobante)(body.id, body.tipo, receptor, correlativo, body.placa, body.usuario, body.producto, body.comentario, body.tipo_afectado, body.numeracion_afectado, body.fecha_afectado, body.tarjeta, body.efectivo, body.yape, body.billete);
        if (hasErrorComprobante) {
            res.json({ hasError: true, respuesta: messageComprobante });
            return;
        }
        const { hasErrorActualizaAbastecimiento, messageActualizaAbastecimiento } = yield (0, abastecimiento_1.actualizaAbastecimiento)(body.id, body.tipo);
        if (hasErrorActualizaAbastecimiento) {
            res.json({ hasError: true, respuesta: messageActualizaAbastecimiento });
            return;
        }
        if (process.env.ENVIOS_ASINCRONOS == '1') {
            res.json({
                hasError: false,
                receptor: receptor,
                comprobante: comprobante,
                respuesta: bCreateOrderMiFact ? "Comprobante guardado y enviado a SUNAT" : "Comprobante generado"
            });
        }
        else {
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
            res.json({
                hasError: false,
                receptor: receptor,
                comprobante: comprobanteUpdate,
                respuesta: bCreateOrderMiFact ? "Comprobante guardado y enviado a SUNAT" : "Comprobante generado"
            });
        }
    }
});
exports.generaComprobante = generaComprobante;
const generaComprobanteV2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo_comprobante, prefijo, Receptor } = req.body;
    const serie = '002';
    const bCreateOrderMiFact = (tipo_comprobante == constantes_1.default.TipoComprobante.Boleta || tipo_comprobante == constantes_1.default.TipoComprobante.Factura || tipo_comprobante == constantes_1.default.TipoComprobante.NotaCredito);
    var responseMiFact;
    const { hasErrorCorrelativo, messageCorrelativo, correlativo } = yield (0, correlativo_1.generaCorrelativo)(tipo_comprobante, serie, prefijo ? prefijo : "");
    if (hasErrorCorrelativo) {
        res.json({ hasError: true, respuesta: messageCorrelativo });
        return;
    }
    const { hasErrorReceptor, messageReceptor, receptor } = yield (0, receptor_1.obtieneReceptor)(Receptor.numero_documento, Receptor.tipo_documento, Receptor.razon_social, Receptor.direccion, Receptor.correo, Receptor.placa);
    if (hasErrorReceptor) {
        res.json({ hasError: true, respuesta: messageReceptor });
        return;
    }
    const { hasErrorComprobante, messageComprobante, comprobante } = yield (0, comprobante_1.nuevoComprobanteV2)(req.body, correlativo, receptor);
    if (hasErrorComprobante) {
        res.json({ hasError: true, respuesta: messageComprobante });
        return;
    }
    if (process.env.ENVIOS_ASINCRONOS == '1') {
        res.json({
            hasError: false,
            receptor: receptor,
            comprobante: comprobante,
            respuesta: bCreateOrderMiFact ? "Comprobante guardado y enviado a SUNAT" : "Comprobante generado"
        });
    }
    else {
        if (bCreateOrderMiFact) {
            const { hasErrorMiFact, messageMiFact, response } = yield (0, api_mifact_1.createOrderApiMiFact)(comprobante, receptor, tipo_comprobante, correlativo);
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
        res.json({
            hasError: false,
            receptor: receptor,
            comprobante: comprobanteUpdate,
            respuesta: bCreateOrderMiFact ? "Comprobante guardado y enviado a SUNAT" : "Comprobante generado"
        });
    }
});
exports.generaComprobanteV2 = generaComprobanteV2;
const modificaComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const bCreateOrderMiFact = (body.tipo == constantes_1.default.TipoComprobante.Boleta || body.tipo == constantes_1.default.TipoComprobante.Factura || body.tipo == constantes_1.default.TipoComprobante.NotaCredito);
    var responseMiFact;
    const correlativo = body.correlativo;
    const { hasErrorReceptor, messageReceptor, receptor } = yield (0, receptor_1.obtieneReceptor)(body.numero_documento ? body.numero_documento : 0, body.tipo_documento, body.razon_social, body.direccion, body.correo, body.placa);
    if (hasErrorReceptor) {
        res.json({ hasError: true, respuesta: messageReceptor });
        return;
    }
    const { hasErrorObtieneComprobante, messageObtieneComprobante, comprobante } = yield (0, comprobante_1.obtieneComprobante)(body.id_comprobante);
    if (hasErrorObtieneComprobante) {
        res.json({ hasError: true, respuesta: messageObtieneComprobante });
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
    const { hasErrorActualizaAbastecimiento, messageActualizaAbastecimiento } = yield (0, abastecimiento_1.actualizaAbastecimiento)(body.id, body.tipo);
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
exports.modificaComprobante = modificaComprobante;
const historicoComprobantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comprobanteParams = req.query;
    const queryAnd = [];
    var queryWhere = {};
    const usuario = yield usuario_1.default.findByPk(comprobanteParams.idUsuario, { raw: true });
    if (usuario) {
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
        const data = yield comprobante_1.Comprobante.findAndCountAll({
            include: [
                { model: receptor_1.default, required: true },
                { model: cierreturno_1.default, required: false },
                { model: usuario_1.default, required: true }
            ],
            where: queryWhere,
            order: [
                ['id', 'DESC']
            ],
            offset: Number(comprobanteParams.offset),
            limit: 5000,
            raw: true
        });
        res.json({
            total: data.count,
            comprobantes: data.rows
        });
    }
    else {
        res.json({
            total: 0,
            comprobantes: null
        });
    }
});
exports.historicoComprobantes = historicoComprobantes;
const cierreTurno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const cierre = yield (0, cierreturno_1.cerrarTurno)({ sessionID: body.session, turno: body.turno, isla: body.isla, efectivo: body.efectivo, tarjeta: body.tarjeta, yape: body.yape });
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
    try {
        const cierre = yield (0, cierreturno_1.obtenerCierreTurno)();
        res.json(cierre);
    }
    catch (error) {
        res.json({
            error
        });
    }
});
exports.listaTurnosPorCerrar = listaTurnosPorCerrar;
const historicoCierres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idUsuario } = req.query;
    const data = yield cierreturno_1.default.findAll({
        where: { UsuarioId: idUsuario },
        order: [
            ['id', 'DESC']
        ],
        limit: 5
    });
    res.json(data);
});
exports.historicoCierres = historicoCierres;
const cierreTurnoGalonaje = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idUsuario } = req.query;
    const data = yield (0, cierreturno_1.obtieneCierreTurnoGalonaje)(idUsuario ? idUsuario.toString() : "");
    res.json(data);
});
exports.cierreTurnoGalonaje = cierreTurnoGalonaje;
const cierreTurnoTotalProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idUsuario } = req.query;
    const data = yield (0, cierreturno_1.obtieneCierreTurnoTotalProducto)(idUsuario ? idUsuario.toString() : "");
    res.json(data);
});
exports.cierreTurnoTotalProducto = cierreTurnoTotalProducto;
const cierreTurnoTotalSoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idUsuario } = req.query;
    const data = yield (0, cierreturno_1.obtieneCierreTurnoTotalSoles)(idUsuario ? idUsuario.toString() : "");
    res.json(data);
});
exports.cierreTurnoTotalSoles = cierreTurnoTotalSoles;
const getComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const comprobante = yield (0, comprobante_1.obtieneComprobante)(id ? +id : 0);
        res.json({
            comprobante
        });
    }
    catch (error) {
        res.json({
            error
        });
    }
});
exports.getComprobante = getComprobante;
const getNotasDespacho = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, limite = 15, desde = 0 } = req.params;
    try {
        var queryFilters = [];
        if (id == "0") {
            queryFilters = [{ estado_nota_despacho: false }, { tipo_comprobante: constantes_1.default.TipoComprobante.NotaDespacho }];
        }
        else {
            queryFilters = [{ estado_nota_despacho: false }, { tipo_comprobante: constantes_1.default.TipoComprobante.NotaDespacho }, { '$Receptore.numero_documento$': id }];
        }
        const data = yield comprobante_1.Comprobante.findAndCountAll({
            include: [
                {
                    model: receptor_1.default,
                    as: 'Receptore'
                }
            ],
            where: { [sequelize_1.Op.and]: queryFilters },
            offset: Number(desde),
            limit: Number(limite),
            raw: true,
        });
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count,
            comprobantes: data.rows
        });
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.getNotasDespacho = getNotasDespacho;
//# sourceMappingURL=comprobantes.js.map