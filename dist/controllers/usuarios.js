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
exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers");
const getUsuarios = (req, res) => {
    res.json({
        msg: 'getUsuarios'
    });
};
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => {
    const { user, password } = req.params;
    try {
        const usuario = usuario_1.default.findAll({ where: { [sequelize_1.Op.and]: [{ usuario: user }, { password: password }] } });
        if (usuario) {
            res.json(usuario);
        }
        else {
            res.status(404).json({
                msg: `Usuario y/o password incorrecto: ${user}`
            });
        }
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
    res.json("");
};
exports.getUsuario = getUsuario;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const usuario = yield usuario_1.default.findOne({ attributes: ['id', 'nombre', 'usuario', 'correo', 'rol', 'grifo', 'isla', 'jornada'], where: { [sequelize_1.Op.and]: [{ usuario: body.user }, { password: body.password }] } });
        (0, helpers_1.log4js)(usuario, 'debug');
        if (usuario) {
            res.json({ usuario });
        }
        else {
            res.status(404).json({
                msg: `Usuario y/o password incorrecto`
            });
        }
    }
    catch (error) {
        console.log(error);
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.postUsuario = postUsuario;
const putUsuario = (req, res) => {
    const { id } = req.params;
    const { body } = req;
    res.json({
        msg: 'putUsuario',
        body
    });
};
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => {
    const { id } = req.params;
    res.json({
        msg: 'deleteUsuario',
        id
    });
};
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=usuarios.js.map