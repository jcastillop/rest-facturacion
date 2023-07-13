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
exports.getAbastecimiento = exports.getAbastecimientos = void 0;
const abastecimiento_1 = __importDefault(require("../models/abastecimiento"));
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers");
const getAbastecimientos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceParams = req.query;
    const queryAnd = [];
    var arrPistolas = [];
    var queryWhere = {};
    if (serviceParams.pistola) {
        arrPistolas = serviceParams.pistola.split(',');
    }
    if (serviceParams.desde) {
        queryAnd.push({ fechaHora: { [sequelize_1.Op.gt]: new Date(serviceParams.desde) } });
    }
    if (serviceParams.hasta) {
        queryAnd.push({ fechaHora: { [sequelize_1.Op.lt]: new Date(serviceParams.hasta) } });
    }
    queryAnd.push({ estado: 0 });
    if (arrPistolas.length > 0 && (0, helpers_1.onlyNumbers)(arrPistolas)) {
        queryWhere = { [sequelize_1.Op.and]: queryAnd, pistola: { [sequelize_1.Op.in]: arrPistolas } };
    }
    else {
        queryWhere = { [sequelize_1.Op.and]: queryAnd };
    }
    const queryParams = {
        where: queryWhere,
        attributes: ['idAbastecimiento', 'registro', 'pistola', 'codigoCombustible', 'valorTotal', 'volTotal', 'precioUnitario', 'tiempo', 'fechaHora', 'totInicio', 'totFinal', 'IDoperador', 'IDcliente', 'volTanque'],
        offset: Number(serviceParams.offset),
        limit: Number(serviceParams.limit)
    };
    const { count, rows } = yield abastecimiento_1.default.findAndCountAll(queryParams);
    res.json({
        total: count,
        abastecimientos: rows
    });
});
exports.getAbastecimientos = getAbastecimientos;
const getAbastecimiento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const abastecimiento = yield abastecimiento_1.default.findByPk(id);
        (0, helpers_1.log4js)(abastecimiento, 'debug');
        if (abastecimiento) {
            res.json(abastecimiento);
        }
        else {
            res.status(404).json({
                msg: `No existe abastecimiento con el id ${id}`
            });
        }
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            msg: `No existe abastecimiento con el123 id ${id}`
        });
    }
});
exports.getAbastecimiento = getAbastecimiento;
//# sourceMappingURL=abastecimientos.js.map