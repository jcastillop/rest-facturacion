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
exports.obtieneComprobante = exports.generaComprobante = void 0;
const models_1 = require("../models");
const receptor_1 = __importStar(require("../models/receptor"));
const api_mifact_1 = require("../helpers/api-mifact");
const item_1 = __importDefault(require("../models/item"));
const generaComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const serie = '001';
    var actualizar;
    //Obtiene correlativo
    try {
        const correlativo = yield (0, models_1.generaCorrelativo)(body.tipo, serie);
        const receptor = yield (0, receptor_1.obtieneReceptor)(body.numero_documento, body.tipo_documento, body.razon_social, body.direccion, body.correo);
        const comprobante_insert = yield (0, models_1.nuevoComprobante)(body.id, body.tipo, receptor, correlativo, body.placa, body.usuario);
        const factura = yield (0, api_mifact_1.createOrderApiMiFact)(comprobante_insert, receptor, body.tipo, correlativo);
        const comprobante = yield (0, models_1.actualizarComprobante)(factura, comprobante_insert.id);
        if (!factura.response.errors) {
            actualizar = yield (0, models_1.actualizaAbastecimiento)(body.id);
        }
        //const actualizar = await actualizaAbastecimiento(body.id);
        res.json({
            receptor,
            factura,
            comprobante
        });
    }
    catch (error) {
        res.json({
            error
        });
    }
});
exports.generaComprobante = generaComprobante;
const obtieneComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comprobantes = yield models_1.Comprobante.findAll({
        include: [
            { model: item_1.default, as: 'Items' },
            { model: receptor_1.default }
        ],
        order: [
            ["id", "DESC"],
        ],
    });
    res.json({
        comprobantes
    });
});
exports.obtieneComprobante = obtieneComprobante;
//# sourceMappingURL=comprobantes.js.map