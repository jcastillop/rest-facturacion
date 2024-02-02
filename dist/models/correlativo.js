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
exports.generaComprobanteFirstStep = exports.generaCorrelativo = void 0;
const config_1 = require("../database/config");
const sequelize_1 = require("sequelize");
const helpers_1 = require("../helpers");
const generaCorrelativo = (tipo, serie, prefijo = "") => __awaiter(void 0, void 0, void 0, function* () {
    var correlativo = '';
    const ruc = process.env.EMISOR_RUC;
    try {
        yield config_1.Sqlcn.query('DECLARE @correlativo NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spCorrelativoObtener :tipo, :serie, :prefijo, :ruc, @correlativo output, @resultado output;SELECT @correlativo as correlativo,@resultado as resultado;', {
            replacements: { tipo, serie, prefijo, ruc },
            type: sequelize_1.QueryTypes.SELECT,
            plain: true
        }).then((results) => {
            correlativo = results.correlativo;
        });
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
const generaComprobanteFirstStep = (idAbastecimiento, idTipoDocumento, idSerie, prefijo, receptorTipoDocumento, receptorNumeroDocumento) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio generaComprobanteFirstStep: abastecimiento " + idAbastecimiento);
    var correlativo = '';
    var correlativo_resultado = '';
    var receptor_id = '';
    var resultado = '';
    const ruc = process.env.EMISOR_RUC;
    try {
        yield config_1.Sqlcn.query('DECLARE @correlativo NVARCHAR(11);DECLARE @correlativo_resultado NVARCHAR(11);DECLARE @receptor_id NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spComprobanteFirstStep :idAbastecimiento, :idTipoDocumento, :idSerie, :prefijo, :ruc, :receptorTipoDocumento, :receptorNumeroDocumento, @correlativo output, @correlativo_resultado output, @receptor_id output, @resultado output;SELECT @correlativo as correlativo,@correlativo_resultado as correlativo_resultado,@receptor_id as receptor_id,@resultado as resultado;', {
            replacements: { idAbastecimiento, idTipoDocumento, idSerie, prefijo, ruc, receptorTipoDocumento, receptorNumeroDocumento },
            type: sequelize_1.QueryTypes.SELECT,
            plain: true
        }).then((results) => {
            correlativo = results.correlativo;
            correlativo_resultado = results.correlativo_resultado;
            receptor_id = results.receptor_id;
            resultado = results.resultado;
        });
        (0, helpers_1.log4js)("Fin generaComprobanteFirstStep: " + correlativo);
        return {
            hasErrorCorrelativo: false,
            messageCorrelativo: "Correlativo generado satisfactoriamente",
            correlativo: correlativo,
            correlativo_resultado: correlativo_resultado,
            receptor_id: receptor_id,
            resultado: resultado
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("generaCorrelativo: " + error.toString(), 'error');
        return {
            hasErrorCorrelativo: true,
            messageCorrelativo: "generaCorrelativo: " + error.toString(),
            correlativo: correlativo,
            correlativo_resultado: correlativo_resultado,
            receptor_id: receptor_id,
            resultado: resultado
        };
    }
});
exports.generaComprobanteFirstStep = generaComprobanteFirstStep;
//# sourceMappingURL=correlativo.js.map