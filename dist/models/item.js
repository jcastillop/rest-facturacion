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
const Item = config_1.Sqlcn.define('Items', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ComprobanteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    valor_unitario: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    precio_unitario: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    igv: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING
    },
    codigo_producto: {
        type: sequelize_1.DataTypes.STRING
    },
    placa: {
        type: sequelize_1.DataTypes.STRING
    },
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
exports.default = Item;
//# sourceMappingURL=item.js.map