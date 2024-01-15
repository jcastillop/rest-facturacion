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
exports.procesarComprobantes = void 0;
const comprobante_1 = require("../models/comprobante");
const item_1 = __importDefault(require("../models/item"));
const receptor_1 = __importDefault(require("../models/receptor"));
const api_mifact_1 = require("./api-mifact");
const constantes_1 = __importDefault(require("./constantes"));
const procesarComprobantes = () => __awaiter(void 0, void 0, void 0, function* () {
    const pendientes = yield comprobante_1.Comprobante.findAll({
        include: [
            { model: item_1.default, as: 'Items' }
        ],
        where: { enviado: 0, tipo_comprobante: [constantes_1.default.TipoComprobante.Factura, constantes_1.default.TipoComprobante.Boleta, constantes_1.default.TipoComprobante.NotaCredito] }
    });
    pendientes.every((comprobante) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(comprobante);
        const receptor = yield receptor_1.default.findByPk(comprobante.ReceptorId, { raw: true });
        const { hasErrorMiFact, messageMiFact, response } = yield (0, api_mifact_1.createOrderApiMiFact)(comprobante, receptor, comprobante.tipo_comprobante, comprobante.numeracion_comprobante);
        if (!hasErrorMiFact) {
            const { hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate } = yield (0, comprobante_1.actualizarComprobante)(response, comprobante.id, true);
        }
    }));
});
exports.procesarComprobantes = procesarComprobantes;
//# sourceMappingURL=app-helpers.js.map