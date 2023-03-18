"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
//import { connect } from "mongoose";
//export const MONGOcn = connect(process.env.MONGODB_CN||'');
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
console.log(process.env.DB_NAME);
const SQLcn = new sequelize_1.Sequelize('GRIFO', 'sa', '1Secure*Password1', {
    host: '192.168.1.11',
    dialect: 'mssql',
    //logging: false//
});
exports.default = SQLcn;
//# sourceMappingURL=config.js.map