"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorSQL = exports.Sqlcn = void 0;
const sequelize_1 = require("sequelize");
//import { connect } from "mongoose";
//export const MONGOcn = connect(process.env.MONGODB_CN||'');
exports.Sqlcn = new sequelize_1.Sequelize('AUXILIAR', 'sa', '1Secure*Password1', {
    host: '192.168.1.2',
    dialect: 'mssql',
    //logging: false//
});
exports.ControladorSQL = new sequelize_1.Sequelize('DEMOSQL', 'sa', '1Secure*Password1', {
    host: '192.168.1.2',
    dialect: 'mssql',
    //logging: false//
});
//# sourceMappingURL=config.js.map