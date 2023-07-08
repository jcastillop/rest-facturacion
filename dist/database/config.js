"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorSQL = exports.Sqlcn = void 0;
const sequelize_1 = require("sequelize");
require('dotenv').config();
//import { connect } from "mongoose";
exports.Sqlcn = new sequelize_1.Sequelize('AUXILIAR', 'sa', '1Secure*Password1', {
    host: process.env.SQL_AUX_HOST,
    dialect: 'mssql',
    //logging: false//
});
exports.ControladorSQL = new sequelize_1.Sequelize('DEMOSQL', 'sa', '1Secure*Password1', {
    host: process.env.SQL_CONTR_HOST,
    dialect: 'mssql',
    //logging: false//
});
//# sourceMappingURL=config.js.map