"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const Producto = config_1.Sqlcn.define('Productos', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    imagenes: {
        type: sequelize_1.DataTypes.BLOB
    },
    stock: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 0
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING,
    },
    medida: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "NIU"
    },
    precio: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0
    },
    valor: {
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
exports.default = Producto;
//# sourceMappingURL=producto.js.map