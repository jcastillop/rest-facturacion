"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log4js = void 0;
const winston = __importStar(require("winston"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const log4js = (data, logLevel = 'debug') => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(JSON.stringify(data));
    logger.log({
        level: logLevel,
        message: JSON.stringify(data)
    });
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
});
exports.log4js = log4js;
const timezoned = () => {
    return new Date().toLocaleString('es-PE', {
        timeZone: 'America/Lima'
    });
};
const transport = new winston_daily_rotate_file_1.default({
    filename: 'log/fact-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: timezoned }), winston_1.format.prettyPrint()),
});
transport.on('rotate', function (oldFilename, newFilename) {
    // do something fun
});
const logger = winston.createLogger({
    transports: [
        transport
    ]
});
//# sourceMappingURL=log4js.js.map