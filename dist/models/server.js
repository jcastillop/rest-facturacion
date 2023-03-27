"use strict";
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
const express_1 = __importDefault(require("express"));
const usuarios_1 = __importDefault(require("../routes/usuarios"));
const abastecimientos_1 = __importDefault(require("../routes/abastecimientos"));
const comprobantes_1 = __importDefault(require("../routes/comprobantes"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../database/config");
class Server {
    constructor() {
        this.apiPaths = {
            usuarios: '/api/usuarios',
            abastecimientos: '/api/abastecimientos',
            comprobantes: '/api/comprobantes'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8800';
        this.conectarDB();
        this.middlewares();
        this.routes();
    }
    conectarDB() {
        return __awaiter(this, void 0, void 0, function* () {
            //await dbConnection()
            try {
                yield config_1.Sqlcn.authenticate();
                console.log('database on lines');
            }
            catch (error) {
            }
        });
    }
    middlewares() {
        //CORS
        this.app.use((0, cors_1.default)());
        //Lectura body
        this.app.use(express_1.default.json());
        //Carepta publica
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.apiPaths.usuarios, usuarios_1.default);
        this.app.use(this.apiPaths.abastecimientos, abastecimientos_1.default);
        this.app.use(this.apiPaths.comprobantes, comprobantes_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor ejecutandose en el puerto: ' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map