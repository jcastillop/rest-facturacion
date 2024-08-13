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
exports.deleteDescuento = exports.updateDescuento = exports.putDescuento = exports.postDescuento = exports.getDescuentos = void 0;
const helpers_1 = require("../helpers");
const descuentos_1 = require("../models/descuentos");
const getDescuentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, estado = 1, limite = 15, desde = 0 } = req.params;
    try {
        const data = yield (0, descuentos_1.obtenerDescuentos)();
        res.json({
            message: data.message,
            descuentos: data.data
        });
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.getDescuentos = getDescuentos;
const postDescuento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio postDescuento");
    const { id } = req.body;
    try {
        const descuento = yield descuentos_1.Descuentos.findOne({ where: { id: id }, raw: true });
        res.json({
            descuento
        });
        (0, helpers_1.log4js)("Fin postDescuento");
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.postDescuento = postDescuento;
const putDescuento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio putDeposito");
    const { codigo_producto, numero_documento, monto_descuento, tipo } = req.body;
    try {
        const invalid = yield descuentos_1.Descuentos.findOne({ where: { numero_documento: numero_documento, codigo_producto: codigo_producto }, raw: true });
        if (invalid) {
            res.json({
                hasError: true,
                message: `Ya existe un descuento registrado al cliente`,
                descuento: null
            });
        }
        else {
            const descuento = descuentos_1.Descuentos.build({
                codigo_producto,
                numero_documento,
                monto_descuento,
                tipo
            });
            yield descuento.save();
            (0, helpers_1.log4js)("Fin putDeposito: " + JSON.stringify(descuento));
            if (descuento) {
                res.json({
                    hasError: false,
                    message: `descuento creado correctamente`,
                    descuento: descuento
                });
            }
            else {
                res.json({
                    hasError: true,
                    message: `Error al crear descuento`,
                    descuento: null
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.putDescuento = putDescuento;
const updateDescuento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio updateDescuento");
    const { id, codigo_producto, numero_documento, monto_descuento, tipo, fecha } = req.body;
    try {
        const descuento = yield descuentos_1.Descuentos.update({
            codigo_producto,
            numero_documento,
            monto_descuento,
            tipo,
            fecha
        }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin updateDescuento: " + JSON.stringify(descuento));
        if (descuento) {
            res.json({
                hasError: false,
                message: `descuento actualizado correctamente`,
                descuento: descuento
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al actualizar descuento`,
                descuento: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.updateDescuento = updateDescuento;
const deleteDescuento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio deleteDescuento");
    const { id } = req.body;
    try {
        const data = yield descuentos_1.Descuentos.update({ estado: 0 }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin deleteDescuento: " + JSON.stringify(data));
        if (data) {
            res.json({
                hasError: false,
                message: `descuento eliminado`,
                deposito: data
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al eliminar descuento/no encontrado`,
                descuento: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.deleteDescuento = deleteDescuento;
//# sourceMappingURL=descuentos.js.map