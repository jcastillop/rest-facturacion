import * as log4jsConfigure from "log4js";

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'; 

export const log4js = async ( data: any, logLevel: LogLevel ) => {
    log4jsConfigure.configure('./data/config/log4js.json');
    const logger = log4jsConfigure.getLogger();
    logger.level = logLevel;
    switch (logLevel) {
        case 'error' :
            logger.error(JSON.stringify(data));
            break;
        default:
            logger.debug(JSON.stringify(data));
            break;
    }
    
}