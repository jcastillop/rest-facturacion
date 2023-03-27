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
exports.generaComprobante = void 0;
const helpers_1 = require("../helpers");
const models_1 = require("../models");
const generaComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    //Obtiene correlativo
    const correlativo = yield (0, models_1.generaCorrelativo)(body.tipo, '001');
    //Completar la información requerida en un modelo 
    // TODO: registro receptor
    // TODO: registro de correo de cliente (opcional)
    const comprobante = yield (0, models_1.nuevoComprobante)(body.id, body.tipo, correlativo);
    //Completar la información de la factura 
    const factura = (0, helpers_1.crearFactura)(comprobante);
    const arrFile = [process.env.EMISOR_RUC, body.tipo, correlativo];
    const file = arrFile.join('-') + '.xml';
    (0, helpers_1.asyncWriteFile)(file, factura);
    //TODO: Firma digital
    res.json({
        file
    });
});
exports.generaComprobante = generaComprobante;
//# sourceMappingURL=comprobantes.js.map