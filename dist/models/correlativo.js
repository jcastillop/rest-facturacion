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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generaCorrelativo = void 0;
const config_1 = require("../database/config");
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers");
const generaCorrelativo = (tipo, serie) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio generaCorrelativo");
    var correlativo = '';
    try {
        yield config_1.Sqlcn.query('DECLARE @correlativo NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spCorrelativoObtener :tipo, :serie, @correlativo output, @resultado output;SELECT @correlativo as correlativo,@resultado as resultado;', {
            replacements: { tipo, serie },
            type: sequelize_1.QueryTypes.SELECT,
            plain: true
        }).then((results) => {
            correlativo = results.correlativo;
        });
        (0, helpers_1.log4js)("Fin generaCorrelativo " + correlativo);
        return {
            hasErrorCorrelativo: false,
            messageCorrelativo: "Correlativo generado satisfactoriamente",
            correlativo: correlativo
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("generaCorrelativo: " + error.toString(), 'error');
        return {
            hasErrorCorrelativo: true,
            messageCorrelativo: "generaCorrelativo: " + error.toString(),
            correlativo: correlativo
        };
    }
});
exports.generaCorrelativo = generaCorrelativo;
//# sourceMappingURL=correlativo.js.map