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
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const Emisor = config_1.Sqlcn.define('Emisores', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ruc: {
        type: sequelize_1.DataTypes.STRING('11'),
        allowNull: false
    },
    razon_social: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    nombre_comercial: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ubigeo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false
});
exports.default = Emisor;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
//# sourceMappingURL=emisor.js.map