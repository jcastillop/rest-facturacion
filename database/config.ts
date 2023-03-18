import { Sequelize } from "sequelize";
//import { connect } from "mongoose";

//export const MONGOcn = connect(process.env.MONGODB_CN||'');
const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbPassword = process.env.DB_PASSWORD
console.log(process.env.DB_NAME);
const SQLcn = new Sequelize('GRIFO', 'sa', '1Secure*Password1', {
    host: '192.168.1.11',
    dialect:'mssql',
    //logging: false//
});

export default SQLcn;