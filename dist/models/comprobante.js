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
exports.Comprobante = exports.validaComprobanteAbastecimiento = exports.generaReporteCierreTurno = exports.generaReporteDeclaracionMensual = exports.generaReporteProductoCombustibleTurnoExcel = exports.generaReporteProductoCombustibleTurno = exports.generaReporteDiarioRangos = exports.actualizarComprobante = exports.obtieneComprobante = exports.nuevoComprobanteV2 = exports.nuevoComprobante = void 0;
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
const constantes_1 = __importDefault(require("../helpers/constantes"));
const date_values_1 = require("../helpers/date-values");
const gastos_1 = __importDefault(require("./gastos"));
const depositos_1 = __importDefault(require("./depositos"));
const receptorplaca_1 = __importDefault(require("./receptorplaca"));
const nuevoComprobante = (idAbastecimiento, tipo, receptor, correlativo, placa, usuario, producto, comentario, tipo_afectado, numeracion_afectado, fecha_afectado, tarjeta = 0, efectivo = 0, yape = 0, billete = 0) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio nuevoComprobante");
    try {
        const abastecimiento = yield abastecimiento_1.default.findByPk(idAbastecimiento);
        var valor_unitario = (parseFloat(abastecimiento.precioUnitario) / 1.18).toFixed(10);
        var igv_unitario = ((parseFloat(valor_unitario) * parseFloat(abastecimiento.volTotal)) * 0.18).toFixed(2);
        var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);
        const numeracion = correlativo.split("-");
        const cadena_qr = [process.env.EMISOR_RUC, tipo, numeracion[0], numeracion[1], igv_unitario, abastecimiento.valorTotal, (0, date_values_1.getTodayDate)(), 0, 0];
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
            pago_yape: yape,
            placa: placa,
            billete: billete,
            producto_precio: abastecimiento.precioUnitario,
            ruc: process.env.EMISOR_RUC,
            cadena_para_codigo_qr: cadena_qr.join('|'),
            codigo_hash: '',
            pdf_bytes: '',
            url: '',
            errors: '',
            Items: [{
                    cantidad: abastecimiento.volTotal,
                    valor_unitario: valor_unitario,
                    precio_unitario: abastecimiento.precioUnitario,
                    igv: igv_unitario,
                    descripcion: producto,
                    codigo_producto: abastecimiento.codigoCombustible,
                    placa: placa,
                    total_unitario: abastecimiento.valorTotal,
                    medida: 'GLL'
                }]
        }, {
            include: [
                { model: item_1.default, as: 'Items' }
            ]
        });
        yield comprobante.save();
        if (tipo == constantes_1.default.TipoComprobante.NotaCredito) {
            exports.Comprobante.update({ motivo_documento_afectado: 'Factura dada de baja' }, { where: { numeracion_comprobante: numeracion_afectado, tipo_comprobante: constantes_1.default.TipoComprobante.Factura } });
        }
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
const nuevoComprobanteV2 = (comprobante, correlativo, receptor) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)(`Inicio nuevoComprobanteV2(${correlativo}):  ${JSON.stringify(comprobante)}`);
    try {
        var arr_items = [];
        comprobante.items.forEach(({ cantidad, valor, precio, igv, descripcion, codigo_producto, medida, precio_venta }) => {
            arr_items.push({
                cantidad: cantidad.toString(),
                valor_unitario: valor.toString(),
                precio_unitario: precio.toString(),
                igv: igv.toString(),
                descripcion: descripcion.toString(),
                codigo_producto: codigo_producto.toString(),
                medida: medida.toString(),
                total_unitario: precio_venta.toString(),
                placa: comprobante.placa.toString()
            });
        });
        const numeracion = correlativo.split("-");
        const cadena_qr = [process.env.EMISOR_RUC, comprobante.tipo_comprobante, numeracion[0], numeracion[1], comprobante.total_igv, comprobante.total_venta, (0, date_values_1.getTodayDate)(), 0, 0];
        const newComprobante = exports.Comprobante.build({
            ReceptorId: receptor.id,
            UsuarioId: comprobante.usuarioId,
            tipo_comprobante: comprobante.tipo_comprobante,
            numeracion_comprobante: correlativo,
            tipo_documento_afectado: comprobante.tipo_comprobante == constantes_1.default.TipoComprobante.NotaCredito ? comprobante.tipo_documento_afectado : "",
            numeracion_documento_afectado: comprobante.tipo_comprobante == constantes_1.default.TipoComprobante.NotaCredito ? comprobante.numeracion_documento_afectado : "",
            fecha_documento_afectado: comprobante.tipo_comprobante == constantes_1.default.TipoComprobante.NotaCredito ? comprobante.fecha_documento_afectado : null,
            total_gravadas: comprobante.gravadas,
            total_igv: comprobante.total_igv,
            total_venta: comprobante.total_venta,
            monto_letras: (0, numeros_letras_1.numbersToLetters)(comprobante.total_venta),
            comentario: comprobante.comentario,
            id_abastecimiento: 1,
            pistola: comprobante.pistola,
            codigo_combustible: comprobante.codigo_combustible,
            dec_combustible: comprobante.dec_combustible,
            volumen: comprobante.volumen,
            fecha_abastecimiento: (0, date_values_1.getTodayDate)(),
            tiempo_abastecimiento: comprobante.tiempo_abastecimiento,
            volumen_tanque: comprobante.volumen_tanque,
            pago_tarjeta: comprobante.tarjeta,
            pago_efectivo: comprobante.efectivo,
            pago_yape: comprobante.yape,
            placa: comprobante.placa,
            billete: comprobante.billete,
            producto_precio: comprobante.producto_precio,
            ruc: process.env.EMISOR_RUC,
            cadena_para_codigo_qr: cadena_qr.join('|'),
            codigo_hash: '',
            pdf_bytes: '',
            url: '',
            errors: '',
            Items: arr_items
        }, {
            include: [
                { model: item_1.default, as: 'Items' }
            ]
        });
        yield newComprobante.save();
        if (comprobante.tipo_comprobante == constantes_1.default.TipoComprobante.NotaCredito) {
            exports.Comprobante.update({ motivo_documento_afectado: 'Comprobante dado de baja' }, { where: { numeracion_comprobante: comprobante.numeracion_documento_afectado, tipo_comprobante: comprobante.tipo_documento_afectado } });
        }
        if (comprobante.tipo_comprobante == constantes_1.default.TipoComprobante.Factura) {
            (0, helpers_1.log4js)(`nuevoComprobante: Inicio Actualizando las notas de despacho asociadas a la factura: ${JSON.stringify(comprobante.items)}`);
            comprobante.items.forEach(({ codigo_producto }) => {
                if (Number.isInteger(codigo_producto)) {
                    exports.Comprobante.update({
                        estado_nota_despacho: 1,
                        comprobante_facturado_nota_despacho: correlativo,
                        fecha_facturado_nota_despacho: (0, date_values_1.getTodayDate)(),
                    }, {
                        where: { id: codigo_producto, tipo_comprobante: constantes_1.default.TipoComprobante.NotaDespacho },
                        returning: true
                    });
                }
            });
            (0, helpers_1.log4js)(`nuevoComprobante: Fin Actualizando las notas de despacho asociadas a la factura `);
        }
        (0, helpers_1.log4js)(`Fin nuevoComprobante: ${JSON.stringify(newComprobante)}`);
        if (newComprobante) {
            return {
                hasErrorComprobante: false,
                messageComprobante: `Comprobante creado correctamente`,
                comprobante: newComprobante
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
exports.nuevoComprobanteV2 = nuevoComprobanteV2;
const obtieneComprobante = (idComprobante) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio obtieneComprobante");
    try {
        const comprobante = yield exports.Comprobante.findByPk(idComprobante, {
            include: [
                { model: item_1.default, as: 'Items' }
            ]
        });
        (0, helpers_1.log4js)("Fin obtieneComprobante: " + JSON.stringify(comprobante));
        if (comprobante) {
            return {
                hasErrorObtieneComprobante: false,
                messageObtieneComprobante: `Comprobante obtenido correctamente`,
                comprobante: comprobante
            };
        }
        else {
            return {
                hasErrorObtieneComprobante: true,
                messageObtieneComprobante: `No se obtuvo comprobante`
            };
        }
    }
    catch (error) {
        (0, helpers_1.log4js)("obtieneComprobante: " + error.toString(), 'error');
        return {
            hasErrorObtieneComprobante: true,
            messageObtieneComprobante: error.toString(),
        };
    }
});
exports.obtieneComprobante = obtieneComprobante;
const actualizarComprobante = (props, idComprobante, createOrderMiFact) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio actualizarComprobante");
    try {
        const data = yield exports.Comprobante.update({
            cadena_para_codigo_qr: createOrderMiFact ? props.cadena_para_codigo_qr : '',
            codigo_hash: createOrderMiFact ? props.codigo_hash : '',
            pdf_bytes: createOrderMiFact ? props.pdf_bytes : '',
            url: createOrderMiFact ? props.url : '',
            errors: createOrderMiFact ? props.errors.substring(0, 255) : '',
            enviado: 1
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
const generaReporteDiarioRangos = (fecha_inicio, fecha_fin) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio generaReporteDiarioRangos");
    var data = null;
    var querySelect = 'SELECT ' +
        'fecha_emision as Fecha, t.turno as Turno, dec_combustible as Producto, tipo_comprobante as Tipo, numeracion_comprobante as Comprobante, ' +
        'r.razon_social as Cliente, r.numero_documento as Documento, cast(volumen as decimal(10,3)) as Volumen, ' +
        'cast(total_venta as decimal(10,2)) as Volumen, cast(total_gravadas as decimal(10,2)) as Gravadas, ' +
        'cast(total_igv as decimal(10,2)) as IGV, cast(total_venta as decimal(10,2)) as Total, u.nombre as Usuario, ' +
        'cast(pago_efectivo as decimal(10,2)) as Efectivo, cast(pago_tarjeta as decimal(10,2)) as Tarjeta, ' +
        'cast(pago_yape as decimal(10,2)) as YapePlin ' +
        'from Comprobantes c ' +
        'inner join Usuarios u on c.UsuarioId = u.id ' +
        'inner join Receptores r on c.ReceptorId = r.id ' +
        'left join Cierreturnos t on c.CierreturnoId = t.id ' +
        'where fecha_emision >= :fecha_inicio and fecha_emision <= :fecha_fin';
    try {
        yield config_1.Sqlcn.query(querySelect, {
            replacements: { fecha_inicio, fecha_fin },
            type: sequelize_1.QueryTypes.SELECT
        }).then((results) => {
            data = results;
        });
        (0, helpers_1.log4js)("Fin generaReporteDiarioRangos ");
        return {
            hasError: false,
            message: "Reporte generado satisfactoriamente",
            data: data
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("generaReporteDiarioRangos: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteDiarioRangos: " + error.toString(),
            data: data
        };
    }
});
exports.generaReporteDiarioRangos = generaReporteDiarioRangos;
const generaReporteProductoCombustibleTurno = (fecha) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio generaReporteProductoCombustibleTurno");
    const fecha_abastecimiento = fecha + ' 20:00:00.0000000 +00:00';
    var querySelect = 'SELECT ROW_NUMBER() OVER (ORDER BY t.turno DESC) AS id, t.turno as Turno, dec_combustible as Producto, ' +
        'cast(sum(case tipo_comprobante when \'01\' then volumen when \'03\' then volumen when \'52\' then volumen else \'0\' end) as decimal(10,3)) as VolumenVenta, ' +
        'cast(sum(case tipo_comprobante when \'50\' then volumen else \'0\' end) as decimal(10,3)) as VolumenDespacho, ' +
        'cast(sum(case tipo_comprobante when \'51\' then volumen else \'0\' end) as decimal(10,3)) as VolumenCalibracion, ' +
        'cast(sum(convert(float,case tipo_comprobante when \'01\' then total_venta when \'03\' then total_venta when \'52\' then total_venta else \'0\' end)) as decimal(10,2)) as TotalVenta, ' +
        'cast(sum(convert(float,case tipo_comprobante when \'50\' then total_venta else \'0\' end)) as decimal(10,2)) as TotalDespacho, ' +
        'cast(sum(convert(float,case tipo_comprobante when \'51\' then total_venta else \'0\' end)) as decimal(10,2)) as TotalCalibracion ';
    var queryFrom = 'from Comprobantes c inner join Cierreturnos t on c.CierreturnoId = t.id ';
    var queryWhere = 'where ((fecha_emision = DATEADD(day, -1,CAST(:fecha AS DATE)) and fecha_abastecimiento > DATEADD(day, -1,CAST(:fecha_abastecimiento AS datetimeoffset)) and t.turno = \'TURNO1\') or  (fecha_emision = :fecha))';
    var queryGroup = 'group by t.turno, dec_combustible order by t.turno desc;';
    var prepareQuery = querySelect + queryFrom + queryWhere + queryGroup;
    var data = null;
    try {
        yield config_1.Sqlcn.query(prepareQuery, {
            replacements: { fecha, fecha_abastecimiento },
            type: sequelize_1.QueryTypes.SELECT
        }).then((results) => {
            data = results;
        });
        (0, helpers_1.log4js)("Fin generaReporteProductoCombustibleTurno ");
        return {
            hasError: false,
            message: "Reporte generado satisfactoriamente",
            data: data
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("generaReporteProductoCombustibleTurno: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteProductoCombustibleTurno: " + error.toString(),
            data: data
        };
    }
});
exports.generaReporteProductoCombustibleTurno = generaReporteProductoCombustibleTurno;
const generaReporteProductoCombustibleTurnoExcel = (fecha, turnos, usuarios) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio generaReporteProductoCombustibleTurno");
    const fecha_abastecimiento = fecha + ' 20:00:00.0000000 +00:00';
    const array = turnos.split(',');
    var querySelect = 'SELECT t.turno as Turno, dec_combustible as Producto, ' +
        'cast(sum(case tipo_comprobante when \'01\' then volumen when \'03\' then volumen when \'52\' then volumen else \'0\' end) as decimal(10,3)) as VolumenVenta, ' +
        'cast(sum(case tipo_comprobante when \'50\' then volumen else \'0\' end) as decimal(10,3)) as VolumenDespacho, ' +
        'cast(sum(case tipo_comprobante when \'51\' then volumen else \'0\' end) as decimal(10,3)) as VolumenCalibracion, ' +
        'sum(convert(float,case tipo_comprobante when \'01\' then total_venta when \'03\' then total_venta when \'52\' then total_venta else \'0\' end)) as TotalVenta, ' +
        'sum(convert(float,case tipo_comprobante when \'50\' then total_venta else \'0\' end)) as TotalDespacho, ' +
        'sum(convert(float,case tipo_comprobante when \'51\' then total_venta else \'0\' end)) as TotalCalibracion ';
    var queryFrom = 'from Comprobantes c inner join Cierreturnos t on c.CierreturnoId = t.id ';
    var queryWhere = 'where ((fecha_emision = DATEADD(day, -1,CAST(:fecha AS DATE)) and fecha_abastecimiento > DATEADD(day, -1,CAST(:fecha_abastecimiento AS datetimeoffset)) and t.turno = \'TURNO1\') or  (fecha_emision = :fecha)) and t.turno in( :array ) ';
    var queryGroup = 'group by t.turno, dec_combustible order by t.turno desc;';
    var prepareQuery = querySelect + queryFrom + queryWhere + queryGroup;
    var data = null;
    try {
        yield config_1.Sqlcn.query(prepareQuery, {
            replacements: { fecha, fecha_abastecimiento, array },
            type: sequelize_1.QueryTypes.SELECT
        }).then((results) => {
            data = results;
        });
        (0, helpers_1.log4js)("Fin generaReporteProductoCombustibleTurno ");
        return {
            hasError: false,
            message: "Reporte generado satisfactoriamente",
            data: data
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("generaReporteProductoCombustibleTurno: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteProductoCombustibleTurno: " + error.toString(),
            data: data
        };
    }
});
exports.generaReporteProductoCombustibleTurnoExcel = generaReporteProductoCombustibleTurnoExcel;
const generaReporteDeclaracionMensual = (month, year) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio generaReporteDeclaracionMensual ");
    var data = null;
    try {
        var query = 'select c.tipo_comprobante, r.tipo_documento, r.numero_documento, c.numeracion_comprobante, c.tipo_documento_afectado, c.numeracion_documento_afectado, c.fecha_emision, LEFT(convert(varchar,c.fecha_abastecimiento,108), 8), CAST(c.total_gravadas as decimal(10,2)) as total_gravadas, CAST(c.total_igv as decimal(10,2)) as total_igv, CAST(c.total_venta as decimal(10,2)) as total_venta, c.dec_combustible, c.volumen, c.pistola, c.tiempo_abastecimiento, c.ruc ' +
            'from Comprobantes c ' +
            'inner join Receptores r on c.ReceptorId = r.id ' +
            'where YEAR(fecha_emision) = :year and MONTH(fecha_emision) = :month and tipo_comprobante in (\'01\',\'03\',\'07\') and c.errors = \'\' ' +
            'order by c.id desc;';
        yield config_1.Sqlcn.query(query, {
            replacements: { year, month },
            type: sequelize_1.QueryTypes.SELECT
        }).then((results) => {
            data = results;
        });
        (0, helpers_1.log4js)("Fin generaReporteDeclaracionMensual");
        return {
            hasError: false,
            message: "Reporte generado satisfactoriamente",
            data: data
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("generaReporteDeclaracionMensual: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteDeclaracionMensual: " + error.toString(),
            data: data
        };
    }
});
exports.generaReporteDeclaracionMensual = generaReporteDeclaracionMensual;
const generaReporteCierreTurno = (fecha) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio generaReporteCierreTurno");
    var data = null;
    try {
        var query = 'SELECT c.id as Id, c.turno as Turno, c.isla as Isla, u.nombre as Usuario, RIGHT( CONVERT(DATETIME, c.fecha),8) as Hora, CAST(c.efectivo AS DECIMAL(10,2)) as Efectivo, CAST(c.tarjeta AS DECIMAL(10,2)) as Tarjeta, CAST(c.yape AS DECIMAL(10,2)) as Yape, CAST(c.total AS DECIMAL(10,2)) as Total ' +
            'FROM Cierreturnos c ' +
            'INNER JOIN Usuarios u on c.UsuarioId = u.id ' +
            'where CAST(fecha as DATE) = CAST(:fecha as DATE)';
        yield config_1.Sqlcn.query(query, {
            replacements: { fecha },
            type: sequelize_1.QueryTypes.SELECT
        }).then((results) => {
            data = results;
        });
        (0, helpers_1.log4js)("Fin generaReporteCierreTurno ");
        return {
            hasError: false,
            message: "Reporte generado satisfactoriamente",
            data: data
        };
    }
    catch (error) {
        (0, helpers_1.log4js)("generaReporteCierreTurno: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteCierreTurno: " + error.toString(),
            data: data
        };
    }
});
exports.generaReporteCierreTurno = generaReporteCierreTurno;
const validaComprobanteAbastecimiento = (idAbastecimiento, tipo_comprobante) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio validaComprobanteAbastecimiento");
    if (tipo_comprobante == constantes_1.default.TipoComprobante.NotaCredito) {
        (0, helpers_1.log4js)("Fin validaComprobanteAbastecimiento ");
        return {
            hasError: false,
            message: `No se valida abastecimiento para NC`
        };
    }
    else {
        const total = yield exports.Comprobante.count({
            where: { id_abastecimiento: idAbastecimiento }
        });
        (0, helpers_1.log4js)("Fin validaComprobanteAbastecimiento ");
        return {
            hasError: total != 0,
            message: `Comprobante se encuentra registrado previamente ${total}`
        };
    }
});
exports.validaComprobanteAbastecimiento = validaComprobanteAbastecimiento;
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
    fecha_documento_afectado: {
        type: sequelize_1.DataTypes.DATEONLY,
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
    pago_yape: {
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
    ruc: {
        type: sequelize_1.DataTypes.STRING
    },
    enviado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    estado_nota_despacho: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    comprobante_nota_despacho: {
        type: sequelize_1.DataTypes.STRING
    },
    fecha_facturado_nota_despacho: {
        type: sequelize_1.DataTypes.DATE
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
gastos_1.default.belongsTo(cierreturno_1.default, {
    foreignKey: {
        name: 'CierreturnoId',
        allowNull: true
    }
});
gastos_1.default.belongsTo(usuario_1.default, {
    foreignKey: {
        name: 'UsuarioId',
        allowNull: false
    }
});
depositos_1.default.belongsTo(cierreturno_1.default, {
    foreignKey: {
        name: 'CierreturnoId',
        allowNull: true
    }
});
depositos_1.default.belongsTo(usuario_1.default, {
    foreignKey: {
        name: 'UsuarioId',
        allowNull: false
    }
});
receptorplaca_1.default.belongsTo(receptor_1.default, {
    foreignKey: {
        name: 'ReceptorId',
        allowNull: false
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.Sqlcn.sync({ force: false });
    // Code here
}))();
//# sourceMappingURL=comprobante.js.map