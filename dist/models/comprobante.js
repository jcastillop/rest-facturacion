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
const terminal_1 = __importDefault(require("./terminal"));
const cierreturno_1 = __importDefault(require("./cierreturno"));
const isla_1 = __importDefault(require("./isla"));
const pistola_1 = __importDefault(require("./pistola"));
const usuario_1 = __importDefault(require("./usuario"));
const login_1 = __importDefault(require("./login"));
const cierredia_1 = __importDefault(require("./cierredia"));
const emisor_1 = __importDefault(require("./emisor"));
const helpers_1 = require("../helpers");
const nuevoComprobante = (idAbastecimiento, tipo, receptor, correlativo, placa, usuario, producto, comentario, tipo_afectado, numeracion_afectado, fecha_afectado, tarjeta = 0, efectivo = 0, billete = 0) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio nuevoComprobante");
    try {
        const abastecimiento = yield abastecimiento_1.default.findByPk(idAbastecimiento);
        var valor_unitario = (parseFloat(abastecimiento.precioUnitario) / 1.18).toFixed(10);
        var igv_unitario = ((parseFloat(valor_unitario) * parseFloat(abastecimiento.volTotal)) * 0.18).toFixed(2);
        var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);
        const comprobante = exports.Comprobante.build({
            ReceptorId: receptor.id,
            UsuarioId: usuario,
            tipo_comprobante: tipo,
            numeracion_comprobante: correlativo,
            tipo_documento_afectado: tipo_afectado,
            numeracion_documento_afectado: numeracion_afectado,
            fecha_documento_afectado: fecha_afectado ? fecha_afectado : null,
            total_gravadas: total_gravadas,
            total_igv: igv_unitario,
            total_venta: abastecimiento.valorTotal,
            monto_letras: (0, numeros_letras_1.numbersToLetters)(abastecimiento.valorTotal),
            comentario: comentario,
            id_abastecimiento: abastecimiento.idAbastecimiento,
            pistola: abastecimiento.pistola,
            codigo_combustible: abastecimiento.codigoCombustible,
            dec_combustible: producto,
            volumen: abastecimiento.volTotal,
            fecha_abastecimiento: abastecimiento.fechaHora,
            tiempo_abastecimiento: abastecimiento.tiempo,
            volumen_tanque: abastecimiento.volTanque,
            pago_tarjeta: tarjeta,
            pago_efectivo: efectivo,
            placa: placa,
            billete: billete,
            producto_precio: abastecimiento.precioUnitario,
            Items: [{
                    cantidad: abastecimiento.volTotal,
                    valor_unitario: valor_unitario,
                    precio_unitario: abastecimiento.precioUnitario,
                    igv: igv_unitario,
                    descripcion: producto,
                    codigo_producto: abastecimiento.codigoCombustible,
                    placa: placa,
                }]
        }, {
            include: [
                { model: item_1.default, as: 'Items' }
            ]
        });
        yield comprobante.save();
        (0, helpers_1.log4js)("Fin nuevoComprobante");
        if (comprobante) {
            return {
                hasErrorComprobante: false,
                messageComprobante: `Comprobante creado correctamente`,
                comprobante: comprobante
            };
        }
        else {
            return {
                hasErrorComprobante: true,
                messageComprobante: "nuevoComprobante: " + `Ocurrió un error durante la creación del comprobante`
            };
        }
    }
    catch (error) {
        (0, helpers_1.log4js)("nuevoComprobante: " + error.toString(), 'error');
        (0, helpers_1.log4js)("Fin nuevoComprobante");
        return {
            hasErrorComprobante: true,
            messageComprobante: "nuevoComprobante: " + error.toString(),
        };
    }
});
exports.nuevoComprobante = nuevoComprobante;
const actualizarComprobante = (props, idComprobante, createOrderMiFact) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio actualizarComprobante");
    try {
        const data = yield exports.Comprobante.update({
            cadena_para_codigo_qr: createOrderMiFact ? props.cadena_para_codigo_qr : '',
            codigo_hash: createOrderMiFact ? props.codigo_hash : '',
            pdf_bytes: createOrderMiFact ? props.pdf_bytes : '',
            url: createOrderMiFact ? props.url : '',
            errors: createOrderMiFact ? props.errors : '',
        }, {
            where: { id: idComprobante },
            returning: true
        });
        (0, helpers_1.log4js)("Fin actualizarComprobante: " + JSON.stringify(data));
        if (data) {
            return {
                hasErrorActualizaComprobante: false,
                messageActualizaComprobante: `Comprobante actualizado correctamente`,
                comprobanteUpdate: data[1][0]
            };
        }
        else {
            return {
                hasErrorActualizaComprobante: true,
                messageActualizaComprobante: `No actualizo ningún comprobante`
            };
        }
    }
    catch (error) {
        (0, helpers_1.log4js)("actualizarComprobante: " + error.toString(), 'error');
        return {
            hasErrorActualizaComprobante: true,
            messageActualizaComprobante: error.toString(),
        };
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
    numeracion_comprobante: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
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
    fecha_documento_afectado: {
        type: sequelize_1.DataTypes.DATEONLY,
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
    id_abastecimiento: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    pistola: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    codigo_combustible: {
        type: sequelize_1.DataTypes.TEXT('tiny'),
        allowNull: false
    },
    dec_combustible: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    volumen: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    fecha_abastecimiento: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    tiempo_abastecimiento: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    volumen_tanque: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    },
    comentario: {
        type: sequelize_1.DataTypes.STRING
    },
    pago_tarjeta: {
        type: sequelize_1.DataTypes.FLOAT
    },
    pago_efectivo: {
        type: sequelize_1.DataTypes.FLOAT
    },
    placa: {
        type: sequelize_1.DataTypes.STRING
    },
    billete: {
        type: sequelize_1.DataTypes.FLOAT
    },
    producto_precio: {
        type: sequelize_1.DataTypes.FLOAT
    },
}, {
    timestamps: false
});
exports.Comprobante.hasMany(item_1.default, {
    foreignKey: 'ComprobanteId'
});
exports.Comprobante.belongsTo(receptor_1.default, {
    foreignKey: 'ReceptorId'
});
exports.Comprobante.belongsTo(usuario_1.default, {
    foreignKey: {
        name: 'UsuarioId',
        allowNull: false
    }
});
exports.Comprobante.belongsTo(cierreturno_1.default, {
    foreignKey: {
        name: 'CierreturnoId',
        allowNull: true
    }
});
exports.Comprobante.belongsTo(receptor_1.default, {
    foreignKey: {
        name: 'ReceptorId',
        allowNull: true
    }
});
/*
Receptor.hasMany(Comprobante, {
    foreignKey: 'ReceptorId'
});
*/
emisor_1.default.hasMany(terminal_1.default, {
    foreignKey: 'EmisorId'
});
terminal_1.default.hasMany(isla_1.default, {
    foreignKey: 'TerminalId'
});
isla_1.default.belongsTo(terminal_1.default, {
    foreignKey: {
        name: 'TerminalId',
        allowNull: false
    }
});
isla_1.default.hasMany(pistola_1.default, {
    foreignKey: 'IslaId'
});
login_1.default.belongsTo(usuario_1.default, {
    foreignKey: 'UsuarioId'
});
cierreturno_1.default.belongsTo(cierredia_1.default, {
    foreignKey: {
        name: 'CierrediaId',
        allowNull: true
    }
});
cierreturno_1.default.belongsTo(usuario_1.default, {
    foreignKey: 'UsuarioId'
});
usuario_1.default.belongsTo(emisor_1.default, {
    foreignKey: {
        name: 'EmisorId',
        allowNull: false
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
//# sourceMappingURL=comprobante.js.map