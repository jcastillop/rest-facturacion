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
exports.Comprobante = exports.actualizarComprobante = exports.nuevoComprobante = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../database/config");
const numeros_letras_1 = require("../helpers/numeros-letras");
const abastecimiento_1 = __importDefault(require("./abastecimiento"));
const item_1 = __importDefault(require("./item"));
const receptor_1 = __importDefault(require("./receptor"));
const usuario_1 = __importDefault(require("./usuario"));
const nuevoComprobante = (idAbastecimiento, tipo, receptor, correlativo, placa, usuario) => __awaiter(void 0, void 0, void 0, function* () {
    const abastecimiento = yield abastecimiento_1.default.findByPk(idAbastecimiento);
    var valor_unitario = (parseFloat(abastecimiento.precioUnitario) / 1.18).toFixed(10);
    var igv_unitario = ((parseFloat(valor_unitario) * parseFloat(abastecimiento.volTotal)) * 0.18).toFixed(2);
    var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);
    const comprobante = exports.Comprobante.build({
        ReceptorId: receptor.id,
        UsuarioId: usuario,
        tipo_comprobante: tipo,
        numeracion_documento_afectado: correlativo,
        total_gravadas: total_gravadas,
        total_igv: igv_unitario,
        total_venta: abastecimiento.valorTotal,
        monto_letras: (0, numeros_letras_1.numbersToLetters)(abastecimiento.valorTotal),
        Items: [{
                cantidad: abastecimiento.volTotal,
                valor_unitario: valor_unitario,
                precio_unitario: abastecimiento.precioUnitario,
                igv: igv_unitario,
                descripcion: 'GLP',
                codigo_producto: abastecimiento.codigoCombustible,
                placa: placa,
            }]
    }, {
        include: [
            { model: item_1.default, as: 'Items' }
        ]
    });
    yield comprobante.save();
    return comprobante;
});
exports.nuevoComprobante = nuevoComprobante;
const actualizarComprobante = (props, idComprobante) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield exports.Comprobante.update({
        cadena_para_codigo_qr: props.response.cadena_para_codigo_qr,
        codigo_hash: props.response.codigo_hash,
        pdf_bytes: props.response.pdf_bytes,
        url: props.response.url,
        errors: props.response.errors,
    }, {
        where: { id: idComprobante },
        returning: true
    });
    if (data) {
        return data[1][0];
    }
});
exports.actualizarComprobante = actualizarComprobante;
exports.Comprobante = config_1.Sqlcn.define('Comprobantes', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipo_comprobante: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    fecha_emision: {
        type: sequelize_1.DataTypes.DATEONLY,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    tipo_moneda: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'PEN'
    },
    tipo_operacion: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: '0101'
    },
    tipo_nota: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipo_documento_afectado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    numeracion_documento_afectado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    motivo_documento_afectado: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    total_gravadas: {
        type: sequelize_1.DataTypes.STRING
    },
    total_igv: {
        type: sequelize_1.DataTypes.STRING
    },
    total_venta: {
        type: sequelize_1.DataTypes.STRING
    },
    monto_letras: {
        type: sequelize_1.DataTypes.STRING
    },
    cadena_para_codigo_qr: {
        type: sequelize_1.DataTypes.STRING
    },
    codigo_hash: {
        type: sequelize_1.DataTypes.STRING
    },
    pdf_bytes: {
        type: sequelize_1.DataTypes.STRING
    },
    url: {
        type: sequelize_1.DataTypes.STRING
    },
    errors: {
        type: sequelize_1.DataTypes.STRING
    },
});
exports.Comprobante.hasMany(item_1.default, {
    foreignKey: 'ComprobanteId'
});
receptor_1.default.hasMany(exports.Comprobante, {
    foreignKey: 'ReceptorId'
});
exports.Comprobante.belongsTo(receptor_1.default, {
    foreignKey: 'ReceptorId'
});
usuario_1.default.hasMany(exports.Comprobante, {
    foreignKey: 'UsuarioId'
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
//# sourceMappingURL=comprobante.js.map