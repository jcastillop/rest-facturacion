"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorSQL = exports.Sqlcn = void 0;
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers");
require('dotenv').config();
//import { connect } from "mongoose";
exports.Sqlcn = new sequelize_1.Sequelize(process.env.SQL_AUX_DB || "", 'sa', process.env.USER_PASS, {
    host: process.env.SQL_AUX_HOST,
    dialect: 'mssql',
    logging: function (sql, queryObject) {
        (0, helpers_1.log4js)(sql, 'debug');
    }
});
exports.ControladorSQL = new sequelize_1.Sequelize(process.env.SQL_CONTR_DB || "", 'sa', process.env.USER_PASS, {
    host: process.env.SQL_CONTR_HOST,
    dialect: 'mssql',
    // logging: function (sql, queryObject: any) {
    //     if(JSON.stringify(queryObject.tableNames) === JSON.stringify(['Abastecimientos']) && queryObject.type == "SELECT"){
    //         console.log("no esta entrando al log");
    //         console.log(sql);
    //     }else{
    //         log4js(queryObject, 'debug');
    //         log4js(sql, 'debug');
    //     }   
    // },     
    //logging: false
});
//# sourceMappingURL=config.js.map