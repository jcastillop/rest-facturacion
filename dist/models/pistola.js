"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const Pistola = config_1.Sqlcn.define('Pistolas', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    codigo_producto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    desc_producto: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: sequelize_1.DataTypes.STRING
    },
    precio_producto: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0
    },
    estado: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    },
}, {
    timestamps: false
});
exports.default = Pistola;
//# sourceMappingURL=pistola.js.map