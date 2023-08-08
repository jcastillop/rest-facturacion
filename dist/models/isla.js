"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const Isla = config_1.Sqlcn.define('Islas', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ip: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    cantidad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    },
}, {
    timestamps: false
});
exports.default = Isla;
//# sourceMappingURL=isla.js.map