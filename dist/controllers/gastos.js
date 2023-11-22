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
exports.deleteGasto = exports.updateGasto = exports.putGasto = exports.postGasto = exports.getGastos = void 0;
const gastos_1 = __importDefault(require("../models/gastos"));
const helpers_1 = require("../helpers");
const sequelize_1 = require("sequelize");
const getGastos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, estado = 1, limite = 15, desde = 0 } = req.params;
    try {
        const queryWhere = { [sequelize_1.Op.and]: [{ CierreturnoId: null }, { UsuarioId: id }] };
        const queryParams = {
            where: queryWhere,
            offset: Number(desde),
            limit: Number(limite),
            raw: true,
        };
        const data = yield gastos_1.default.findAndCountAll(queryParams);
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count,
            gastos: data.rows
        });
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.getGastos = getGastos;
const postGasto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio getGasto");
    const { id } = req.body;
    try {
        const producto = yield gastos_1.default.findOne({ where: { id: id }, raw: true });
        res.json({
            producto
        });
        (0, helpers_1.log4js)("Fin getGasto");
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.postGasto = postGasto;
const putGasto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio putGasto");
    const { concepto, monto, usuario_gasto, autorizado, turno, UsuarioId } = req.body;
    try {
        const gasto = gastos_1.default.build({
            concepto,
            monto,
            usuario_gasto,
            autorizado,
            turno,
            UsuarioId
        });
        yield gasto.save();
        (0, helpers_1.log4js)("Fin putGasto: " + JSON.stringify(gasto));
        if (gasto) {
            res.json({
                hasError: false,
                message: `gasto creado correctamente`,
                gasto: gasto
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al crear gasto`,
                gasto: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.putGasto = putGasto;
const updateGasto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio updateGasto");
    const { id, concepto, monto, usuario_gasto, autorizado, turno } = req.body;
    try {
        const gasto = yield gastos_1.default.update({
            concepto, monto, usuario_gasto, autorizado, turno
        }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin updateGasto: " + JSON.stringify(gasto));
        if (gasto) {
            res.json({
                hasError: false,
                message: `gasto actualizado correctamente`,
                gasto: gasto
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al actualizar gasto`,
                gasto: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.updateGasto = updateGasto;
const deleteGasto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio deleteGasto");
    const { id } = req.body;
    try {
        const data = yield gastos_1.default.update({ estado: 0 }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin deleteGasto: " + JSON.stringify(data));
        if (data) {
            res.json({
                hasError: false,
                message: `Gasto eliminado`,
                gasto: data
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al eliminar gasto/no encontrado`,
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
exports.deleteGasto = deleteGasto;
//# sourceMappingURL=gastos.js.map