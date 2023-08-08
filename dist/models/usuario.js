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
exports.validaUsuarios = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const validaUsuarios = (usuario) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Usuario.findAll({
        where: { usuario: usuario }
    });
    if (data.length > 0) {
        return false;
    }
    else {
        return true;
    }
});
exports.validaUsuarios = validaUsuarios;
const Usuario = config_1.Sqlcn.define('Usuarios', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    usuario: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false
    },
    img: {
        type: sequelize_1.DataTypes.BLOB,
    },
    rol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['ADMIN_ROLE', 'USER_ROLE', 'SUPERV_ROLE']]
        }
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: false
});
exports.default = Usuario;
//# sourceMappingURL=usuario.js.map