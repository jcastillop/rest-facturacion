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
exports.generaComprobante = void 0;
const abastecimiento_1 = __importDefault(require("../models/abastecimiento"));
const config_1 = require("../database/config");
const sequelize_1 = require("sequelize");
const comprobante_1 = __importDefault(require("../models/comprobante"));
const item_1 = __importDefault(require("../models/item"));
const xml_builder_1 = require("../helpers/xml-builder");
const manage_file_1 = require("../helpers/manage-file");
const generaComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log(body);
    let correlativo = '', resultado = '000';
    //Obtiene correlativo
    const result = yield config_1.Sqlcn.query('DECLARE @correlativo NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spCorrelativoObtener :tipo, :serie, @correlativo output, @resultado output;SELECT @correlativo as correlativo,@resultado as resultado;', {
        replacements: { tipo: "01", serie: '001' },
        type: sequelize_1.QueryTypes.SELECT,
        plain: true
    }).then((results) => {
        correlativo = results.correlativo;
        resultado = results.resultado;
    });
    //Completar la información requerida en un modelo 
    const abastecimiento = yield abastecimiento_1.default.findByPk(body.id);
    //Guardar en BD   
    console.log(abastecimiento);
    const comprobante = comprobante_1.default.build({
        tipo_comprobante: '01',
        numeracion_documento_afectado: correlativo,
        total_gravadas: '',
        total_igv: '',
        total_venta: '',
        Items: [{
                cantidad: abastecimiento.volTotal,
                valor_unitario: (parseFloat(abastecimiento.precioUnitario) / 1.18).toFixed(10),
                precio_unitario: abastecimiento.precioUnitario,
                igv: (parseFloat(abastecimiento.precioUnitario) * (18 / 118)).toFixed(2),
                descripcion: 'GLP',
                codigo_producto: '07',
                placa: '4298-PA',
            }]
    }, {
        include: [{
                model: item_1.default,
                as: 'Items'
            }]
    });
    yield comprobante.save();
    //Crear el archivo XML    
    const factura = (0, xml_builder_1.crearFactura)(comprobante);
    //console.log(factura);
    (0, manage_file_1.syncWriteFile)('./factura.xml', factura);
    /*
    res.json({
        abastecimiento
    });
    */
    //TODO: Almacenar el archivo XML
    if (resultado = '000') {
        res.json(resultado);
    }
    else {
        res.status(404).json({
            msg: `Existen errores ${resultado}`, resultado
        });
    }
});
exports.generaComprobante = generaComprobante;
//# sourceMappingURL=comprobantes.js.map