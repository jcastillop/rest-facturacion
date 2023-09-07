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
exports.adminAuthorize = exports.deleteUsuario = exports.changePassword = exports.resetPassword = exports.putUsuario = exports.postUsuario = exports.postUsuarioLogin = exports.getValidaIp = exports.getUsuario = exports.getUsuarios = void 0;
const usuario_1 = __importStar(require("../models/usuario"));
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers");
const isla_1 = __importDefault(require("../models/isla"));
const ipaddr_js_1 = __importDefault(require("ipaddr.js"));
const login_1 = require("../models/login");
const terminal_1 = __importDefault(require("../models/terminal"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { count, rows } = yield usuario_1.default.findAndCountAll();
        if (rows) {
            res.json({ usuarios: rows });
        }
        else {
            res.status(404).json({
                msg: `No existen usuarios`
            });
        }
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
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
const getValidaIp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let remoteAddress = req.ip;
    if (ipaddr_js_1.default.isValid(req.ip)) {
        remoteAddress = ipaddr_js_1.default.process(req.ip).toString();
    }
    else {
        remoteAddress = "";
    }
    try {
        const isla = yield isla_1.default.findOne({ where: { ip: remoteAddress }, include: [{ model: terminal_1.default }] });
        if (isla && isla.Terminale) {
            res.json({
                message: `Isla existe`,
                hasError: false,
                terminal: isla.Terminale.nombre,
                isla: isla.nombre
            });
        }
        else {
            res.json({
                message: `Isla o terminal no registrada`,
                hasError: true,
                terminal: "",
                isla: ""
            });
        }
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.getValidaIp = getValidaIp;
const postUsuarioLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password, turno, isla, terminal } = req.body;
    let remoteAddress = req.ip;
    //console.log(remoteAddress);
    if (ipaddr_js_1.default.isValid(req.ip)) {
        remoteAddress = ipaddr_js_1.default.process(req.ip).toString();
    }
    var today = new Date();
    today.setHours(today.getHours() - 5);
    try {
        //console.log(remoteAddress);
        //const isla: any = await Isla.findOne({ where: { ip: remoteAddress }, include: [ { model: Terminal } ]});
        //console.log(isla);
        const usuario = yield (0, login_1.nuevoLogin)(user, password, terminal, isla, turno, remoteAddress, today);
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
exports.postUsuarioLogin = postUsuarioLogin;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        if (yield (0, usuario_1.validaUsuarios)(body.usuario)) {
            const usuario = yield usuario_1.default.create({
                nombre: body.nombre,
                usuario: body.usuario,
                correo: body.correo,
                password: 'MTIzNA==',
                rol: body.rol,
                EmisorId: body.EmisorId
            });
            res.json({
                message: `Usuario creado correctamente`,
                usuario: usuario,
                hasError: false
            });
        }
        else {
            res.json({
                message: `Usuario ya existe`,
                hasError: true
            });
        }
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            hasError: true,
            message: `Error no identificado ${error}`
        });
    }
});
exports.postUsuario = postUsuario;
const putUsuario = (req, res) => {
    const { id } = req.params;
    const { body } = req;
};
exports.putUsuario = putUsuario;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const data = yield usuario_1.default.update({
            password: 'MTIzNA=='
        }, {
            where: { id: body.id },
            returning: true
        });
        res.json({
            message: `Password reiniciado correctamente`,
            hasError: false
        });
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            message: `Error no identificado ${error}`,
            hasError: true
        });
    }
});
exports.resetPassword = resetPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const encoded = Buffer.from(body.password, 'utf8').toString('base64');
    try {
        const data = yield usuario_1.default.update({
            password: encoded
        }, {
            where: { id: body.id },
            returning: true
        });
        res.json({
            message: `Password cambiado correctamente`,
            hasError: false
        });
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${error}`,
            hasError: true
        });
    }
});
exports.changePassword = changePassword;
const deleteUsuario = (req, res) => {
    const { id } = req.params;
    res.json({
        msg: 'deleteUsuario',
        id
    });
};
exports.deleteUsuario = deleteUsuario;
const adminAuthorize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const encoded = Buffer.from(body.password, 'utf8').toString('base64');
        const data = yield usuario_1.default.findOne({ where: { password: encoded, rol: 'ADMIN_ROLE' } });
        if (data) {
            res.json({
                message: `Contaseña correcta`,
                hasSuccess: true
            });
        }
        else {
            res.json({
                message: `La contraseña proporcionada no coincide`,
                hasSuccess: false
            });
        }
    }
    catch (error) {
        (0, helpers_1.log4js)(error, 'error');
        res.status(404).json({
            message: `Error no identificado ${error}`,
            hasSuccess: false
        });
    }
});
exports.adminAuthorize = adminAuthorize;
//# sourceMappingURL=usuarios.js.map