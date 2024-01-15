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
exports.deleteDeposito = exports.updateDeposito = exports.putDeposito = exports.postDeposito = exports.getDepositos = void 0;
const depositos_1 = __importDefault(require("../models/depositos"));
const helpers_1 = require("../helpers");
const sequelize_1 = require("sequelize");
const getDepositos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, estado = 1, limite = 15, desde = 0 } = req.params;
    try {
        const queryWhere = { [sequelize_1.Op.and]: [{ CierreturnoId: null }, { UsuarioId: id }] };
        const queryParams = {
            where: queryWhere,
            offset: Number(desde),
            limit: Number(limite),
            raw: true,
        };
        const data = yield depositos_1.default.findAndCountAll(queryParams);
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count,
            depositos: data.rows
        });
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.getDepositos = getDepositos;
const postDeposito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio postDeposito");
    const { id } = req.body;
    try {
        const producto = yield depositos_1.default.findOne({ where: { id: id }, raw: true });
        res.json({
            producto
        });
        (0, helpers_1.log4js)("Fin postDeposito");
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.postDeposito = postDeposito;
const putDeposito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio putDeposito");
    const { concepto, monto, usuario, turno, UsuarioId } = req.body;
    try {
        const deposito = depositos_1.default.build({
            concepto,
            monto,
            usuario,
            turno,
            UsuarioId
        });
        yield deposito.save();
        (0, helpers_1.log4js)("Fin putDeposito: " + JSON.stringify(deposito));
        if (deposito) {
            res.json({
                hasError: false,
                message: `deposito creado correctamente`,
                deposito: deposito
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al crear deposito`,
                deposito: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.putDeposito = putDeposito;
const updateDeposito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio updateDeposito");
    const { id, concepto, monto, usuario, turno } = req.body;
    try {
        const deposito = yield depositos_1.default.update({
            concepto, monto, usuario, turno
        }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin updateDeposito: " + JSON.stringify(deposito));
        if (deposito) {
            res.json({
                hasError: false,
                message: `deposito actualizado correctamente`,
                deposito: deposito
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al actualizar deposito`,
                deposito: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.updateDeposito = updateDeposito;
const deleteDeposito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio deleteDeposito");
    const { id } = req.body;
    try {
        const data = yield depositos_1.default.update({ estado: 0 }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin deleteDeposito: " + JSON.stringify(data));
        if (data) {
            res.json({
                hasError: false,
                message: `deposito eliminado`,
                deposito: data
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al eliminar deposito/no encontrado`,
                producto: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.deleteDeposito = deleteDeposito;
//# sourceMappingURL=depositos.js.map