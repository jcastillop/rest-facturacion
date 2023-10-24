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
exports.nuevoLogin = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const helpers_1 = require("../helpers");
const usuario_1 = __importDefault(require("./usuario"));
const nuevoLogin = (user, password, terminal, isla, jornada, ip, fecha_registro) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield usuario_1.default.findOne({ attributes: ["id", "usuario", "nombre", "correo", "rol"], where: { [sequelize_1.Op.and]: [{ usuario: user }, { password: password }] } });
        if (usuario) {
            var inicio_sesion = null;
            const id = usuario.id;
            if (jornada == 'TURNO1') {
                yield config_1.Sqlcn.query('SELECT min(fecha_registro) as inicio_sesion from Logins where UsuarioId = :id and jornada = :jornada and (case when DATEPART(HOUR, :fecha_registro) < 12 then DATEADD(DAY,-1,CONVERT(date,:fecha_registro)) when DATEPART(HOUR, :fecha_registro) > 12 then CONVERT(date, :fecha_registro) end) = CONVERT(date, fecha_registro)', {
                    replacements: { id, jornada, fecha_registro },
                    type: sequelize_1.QueryTypes.SELECT,
                    plain: true
                }).then((results) => {
                    inicio_sesion = results.inicio_sesion;
                });
            }
            else {
                yield config_1.Sqlcn.query('SELECT min(fecha_registro) as inicio_sesion from Logins where UsuarioId = :id and jornada = :jornada and CONVERT(date, fecha_registro) = CONVERT(date, :fecha_registro)', {
                    replacements: { id, jornada, fecha_registro },
                    type: sequelize_1.QueryTypes.SELECT,
                    plain: true
                }).then((results) => {
                    inicio_sesion = results.inicio_sesion;
                });
            }
            console.log(inicio_sesion);
            const login = Login.build({
                UsuarioId: usuario.id,
                terminal: terminal,
                isla: isla,
                jornada: jornada,
                ip: ip,
                fecha_registro: fecha_registro,
                fecha_inicio: inicio_sesion ? inicio_sesion : fecha_registro
            }, {
                include: [
                    { model: usuario_1.default }
                ]
            });
            yield login.save();
            return { usuario, login };
        }
    }
    catch (error) {
        console.log(error);
        (0, helpers_1.log4js)(error, 'error');
        return null;
    }
    return null;
});
exports.nuevoLogin = nuevoLogin;
const Login = config_1.Sqlcn.define('Logins', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    terminal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isla: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    jornada: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['TURNO1', 'TURNO2', 'TURNO3']]
        }
    },
    ip: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    fecha_registro: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    fecha_inicio: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    timestamps: false
});
exports.default = Login;
//# sourceMappingURL=login.js.map