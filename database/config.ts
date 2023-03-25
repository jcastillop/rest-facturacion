import { Sequelize } from "sequelize";
//import { connect } from "mongoose";

//export const MONGOcn = connect(process.env.MONGODB_CN||'');

export const Sqlcn = new Sequelize('AUXILIAR', 'sa', '1Secure*Password1', {
    host: '192.168.1.2',
    dialect:'mssql',
    //logging: false//
});

export const ControladorSQL = new Sequelize('DEMOSQL', 'sa', '1Secure*Password1', {
    host: '192.168.1.2',
    dialect:'mssql',
    //logging: false//
});

