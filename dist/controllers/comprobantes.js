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
const models_1 = require("../models");
const receptor_1 = require("../models/receptor");
const api_mifact_1 = require("../helpers/api-mifact");
const generaComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const serie = '001';
    var actualizar;
    //Obtiene correlativo
    try {
        const correlativo = yield (0, models_1.generaCorrelativo)(body.tipo, serie);
        const receptor = yield (0, receptor_1.obtieneReceptor)(body.numero_documento, body.tipo_documento, body.razon_social, body.direccion, body.correo);
        const comprobante = yield (0, models_1.nuevoComprobante)(body.id, body.tipo, receptor, correlativo, body.placa, body.usuario);
        const factura = yield (0, api_mifact_1.createOrderApiMiFact)(comprobante, receptor, body.tipo, correlativo);
        if (!factura.response.errors) {
            actualizar = yield (0, models_1.actualizaAbastecimiento)(body.id);
        }
        //const actualizar = await actualizaAbastecimiento(body.id);
        res.json({
            correlativo,
            receptor,
            comprobante,
            factura,
            actualizar
        });
    }
    catch (error) {
        res.json({
            error
        });
    }
    //Creación del XML
    //const facturaXML = makeXMLFactura(comprobante, receptor);
    //Firmar digitalmente
    //const facturaXMLSign = signXml(facturaXML);
    //Guardar el documento
    //const file = [process.env.EMISOR_RUC , body.tipo, correlativo].join('-')
    //asyncWriteFile(file + '.xml', facturaXML);
});
exports.generaComprobante = generaComprobante;
//# sourceMappingURL=comprobantes.js.map