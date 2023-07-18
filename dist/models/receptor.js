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
exports.obtieneReceptor = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const obtieneReceptor = (numero_documento, tipo_documento, razon_social, direccion, correo) => __awaiter(void 0, void 0, void 0, function* () {
    const [receptor, created] = yield Receptor.findOrCreate({
        where: { numero_documento: numero_documento },
        defaults: {
            tipo_documento: tipo_documento,
            razon_social: razon_social,
            direccion: direccion,
            correo: correo
        }
    });
    return receptor;
});
exports.obtieneReceptor = obtieneReceptor;
const Receptor = config_1.Sqlcn.define('Receptores', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_documento: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true
    },
    tipo_documento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    razon_social: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
exports.default = Receptor;
//# sourceMappingURL=receptor.js.map