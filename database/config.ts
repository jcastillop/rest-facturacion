import { Sequelize } from "sequelize";
import { log4js } from "../helpers";
require('dotenv').config()
//import { connect } from "mongoose";

export const Sqlcn = new Sequelize(process.env.SQL_AUX_DB||"", 'sa', process.env.USER_PASS, {
    host: process.env.SQL_AUX_HOST,
    dialect:'mssql',
    logging: function (sql, queryObject: any) {
        log4js(sql, 'debug');
    }
});

export const ControladorSQL = new Sequelize(process.env.SQL_CONTR_DB||"", 'sa', process.env.USER_PASS, {
    host: process.env.SQL_CONTR_HOST,
    dialect:'mssql',
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

