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
exports.updateReceptor = exports.putReceptor = exports.geReceptores = exports.autocompletarRuc = void 0;
const receptor_1 = __importDefault(require("../models/receptor"));
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers");
const api_mifact_1 = require("../helpers/api-mifact");
const autocompletarRuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { valor } = req.body;
    const { hasErrorMiFact, messageMiFact, razon_social, direccion } = yield (0, api_mifact_1.consultaRucMiFact)(valor);
    if (hasErrorMiFact) {
        const receptores = yield receptor_1.default.findAll({
            where: {
                numero_documento: {
                    [sequelize_1.Op.like]: `${valor}%`
                }
            },
            raw: true
        });
        res.json({
            receptores
        });
    }
    else {
        res.json({
            receptores: [
                {
                    "numero_documento": valor,
                    "razon_social": razon_social,
                    "direccion": direccion
                }
            ]
        });
    }
});
exports.autocompletarRuc = autocompletarRuc;
const geReceptores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estado = 1, limite = 15, desde = 0 } = req.query;
    try {
        const queryParams = {
            offset: Number(desde),
            limit: Number(limite),
            raw: true
        };
        const data = yield receptor_1.default.findAndCountAll(queryParams);
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count,
            receptores: data.rows
        });
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.geReceptores = geReceptores;
const putReceptor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio putReceptor");
    const { numero_documento, tipo_documento, razon_social, direccion, correo, placa } = req.body;
    try {
        const receptor = receptor_1.default.build({
            numero_documento,
            tipo_documento,
            razon_social,
            direccion,
            correo,
            placa
        });
        yield receptor.save();
        (0, helpers_1.log4js)("Fin putReceptor: " + JSON.stringify(receptor));
        if (receptor) {
            res.json({
                hasError: false,
                message: `receptor creado correctamente`,
                receptor: receptor
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al crear producto`,
                receptor: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.putReceptor = putReceptor;
const updateReceptor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio updateReceptor");
    const { id, numero_documento, tipo_documento, razon_social, direccion, correo, placa } = req.body;
    try {
        const receptor = yield receptor_1.default.update({
            numero_documento,
            tipo_documento,
            razon_social,
            direccion,
            correo,
            placa
        }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin updateReceptor: " + JSON.stringify(receptor));
        if (receptor) {
            res.json({
                hasError: false,
                message: `receptor actualizado correctamente`,
                producto: receptor
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al actualizar receptor`,
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
exports.updateReceptor = updateReceptor;
//# sourceMappingURL=receptores.js.map