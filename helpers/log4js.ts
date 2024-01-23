import * as log4jsConfigure from "log4js";
import  *  as  winston  from  'winston';
import  DailyRotateFile from 'winston-daily-rotate-file';

// var winston = require('winston');

type LogLevel = 'http' | 'debug' | 'info' | 'warn' | 'error' | 'verbose' | 'debug' | 'silly' ; 

export const log4js = async ( data: any, logLevel: LogLevel = 'debug' ) => {

    logger.info(JSON.stringify(data));
    logger.log({
        level: logLevel,
        message: JSON.stringify(data)
    })
    // log4jsConfigure.configure('./data/config/log4js.json');
    // const logger = log4jsConfigure.getLogger();
    // logger.level = logLevel;
    // switch (logLevel) {
    //     case 'error' :
    //         logger.error(JSON.stringify(data));
    //         break;
    //     default:
    //         logger.debug(JSON.stringify(data));
    //         break;
    // }
    
}

const transport: DailyRotateFile = new DailyRotateFile({
    filename: 'log/fact-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
transport.on('rotate', function(oldFilename, newFilename) {
// do something fun
});
const logger = winston.createLogger({
    transports: [
        transport
    ]
});