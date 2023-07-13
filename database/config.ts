import { Sequelize } from "sequelize";
import { log4js } from "../helpers";
require('dotenv').config()
//import { connect } from "mongoose";

export const Sqlcn = new Sequelize('AUXILIAR', 'sa', '1Secure*Password1', {
    host: process.env.SQL_AUX_HOST,
    dialect:'mssql',
    //logging: false//
});

export const ControladorSQL = new Sequelize('DEMOSQL', 'sa', '1Secure*Password1', {
    host: process.env.SQL_CONTR_HOST,
    dialect:'mssql',
    // logging: function (str) {
    //     log4js(str, 'debug');
    // }        
    //logging: false//
});

