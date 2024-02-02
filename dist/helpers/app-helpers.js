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
exports.automatismosCambiarComprobantesInternos = exports.automatismoObtenerReceptor = exports.automatismoGenerarComprobantes = exports.procesarComprobantes = void 0;
const sequelize_1 = require("sequelize");
const comprobante_1 = require("../models/comprobante");
const correlativo_1 = require("../models/correlativo");
const item_1 = __importDefault(require("../models/item"));
const receptor_1 = __importDefault(require("../models/receptor"));
const api_mifact_1 = require("./api-mifact");
const constantes_1 = __importDefault(require("./constantes"));
const log4js_1 = require("./log4js");
const procesarComprobantes = () => __awaiter(void 0, void 0, void 0, function* () {
    const pendientes = yield comprobante_1.Comprobante.findAll({
        include: [
            { model: item_1.default, as: 'Items' }
        ],
        where: { enviado: 0, tipo_comprobante: [constantes_1.default.TipoComprobante.Factura, constantes_1.default.TipoComprobante.Boleta, constantes_1.default.TipoComprobante.NotaCredito] }
    });
    pendientes.every((comprobante) => __awaiter(void 0, void 0, void 0, function* () {
        const receptor = yield receptor_1.default.findByPk(comprobante.ReceptorId, { raw: true });
        const { hasErrorMiFact, messageMiFact, response } = yield (0, api_mifact_1.createOrderApiMiFact)(comprobante, receptor, comprobante.tipo_comprobante, comprobante.numeracion_comprobante);
        if (!hasErrorMiFact) {
            const { hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate } = yield (0, comprobante_1.actualizarComprobante)(response, comprobante.id, true);
        }
    }));
});
exports.procesarComprobantes = procesarComprobantes;
const automatismoGenerarComprobantes = (id_abastecimiento, id_usuario, producto, monto) => __awaiter(void 0, void 0, void 0, function* () {
    (0, log4js_1.log4js)("Inicio automatismoGenerarComprobantes");
    const serie = '002';
    const tipo_comprobante = constantes_1.default.TipoComprobante.Interno;
    const prefijo = 'I';
    const { hasErrorCorrelativo, messageCorrelativo, correlativo, correlativo_resultado, receptor_id, resultado } = yield (0, correlativo_1.generaComprobanteFirstStep)(id_abastecimiento, tipo_comprobante, serie, prefijo, 0, '0');
    const { hasErrorComprobante, messageComprobante, comprobante } = yield (0, comprobante_1.nuevoComprobante)(id_abastecimiento.toString(), tipo_comprobante, { id: process.env.AUTOAMTIC_RECEPTOR_ID }, correlativo, "", id_usuario, producto, "", "", "", "", 0, monto, 0, 0);
    (0, log4js_1.log4js)("Inicio automatismoGenerarComprobantes");
});
exports.automatismoGenerarComprobantes = automatismoGenerarComprobantes;
const automatismoObtenerReceptor = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield receptor_1.default.findOne({ where: { enviado: 0 }, order: (0, sequelize_1.literal)('rand()'), limit: 1, raw: true });
});
exports.automatismoObtenerReceptor = automatismoObtenerReceptor;
const automatismosCambiarComprobantesInternos = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, log4js_1.log4js)("Inicio cambiarComprobantesInternos");
    const internos = yield comprobante_1.Comprobante.findAll({
        include: [
            { model: item_1.default, as: 'Items' }
        ],
        where: { enviado: 0, tipo_comprobante: constantes_1.default.TipoComprobante.Interno }
    });
    internos.every((interno) => __awaiter(void 0, void 0, void 0, function* () {
        (0, log4js_1.log4js)("Loop inicio cambiarComprobantesInternos: " + JSON.stringify(interno));
        const serie = '002';
        const emisor_id = +process.env.AUTOAMTIC_EMISOR_ID;
        const receptor = yield receptor_1.default.findOne({ where: { automatismos: 1 }, order: (0, sequelize_1.literal)('rand()'), limit: 1, raw: true });
        const { hasErrorCorrelativo, messageCorrelativo, correlativo } = yield (0, correlativo_1.generaCorrelativo)(constantes_1.default.TipoComprobante.Factura, serie, "F");
        const { hasErrorComprobante, messageComprobante, comprobante } = yield (0, comprobante_1.nuevoComprobante)(interno.id_abastecimiento, constantes_1.default.TipoComprobante.Factura, receptor, correlativo, receptor.placa, emisor_id, interno.dec_combustible, "", "", "", "", 0, interno.pago_efectivo, 0, 0);
        if (!hasErrorCorrelativo && !hasErrorComprobante) {
            const comprobante = yield comprobante_1.Comprobante.update({ enviado: 1, comentario: correlativo }, { where: { id: interno.id }, returning: true });
            (0, log4js_1.log4js)(JSON.stringify(comprobante));
        }
        (0, log4js_1.log4js)("Loop fin cambiarComprobantesInternos: " + messageComprobante);
    }));
    (0, log4js_1.log4js)("Fin cambiarComprobantesInternos");
});
exports.automatismosCambiarComprobantesInternos = automatismosCambiarComprobantesInternos;
//# sourceMappingURL=app-helpers.js.map