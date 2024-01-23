"use strict";
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
    medida: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    timestamps: false
});
exports.default = Item;
//# sourceMappingURL=item.js.map