import { DataTypes, IntegerDataType, Op, QueryTypes, Sequelize } from "sequelize";
import { Sqlcn } from '../database/config';
import { numbersToLetters } from "../helpers/numeros-letras";
import Abastecimiento from "./abastecimiento";
import Item from "./item";

import { PropsMiFact } from "../helpers/api-mifact";
import Receptor from "./receptor";
import Terminal from "./terminal";
import Cierreturno from "./cierreturno";
import Isla from "./isla";
import Pistola from "./pistola";
import Usuario from "./usuario";
import Login from "./login";
import Cierredia from "./cierredia";
import Emisor from "./emisor";
import { log4js } from "../helpers";
import Constantes from "../helpers/constantes";
import { IComprobanteAdmin, IComprobanteAdminItem } from "../interfaces/comprobante";
import { getTodayDate } from "../helpers/date-values";
import Gastos from "./gastos";
import Depositos from "./depositos";


export const nuevoComprobante = async (idAbastecimiento: string, tipo:string, receptor:any, correlativo: string, placa: string, usuario: number, producto: string, comentario: string, tipo_afectado: string, numeracion_afectado: string, fecha_afectado: string, tarjeta: number = 0, efectivo: number = 0, yape: number = 0, billete: number = 0): Promise<any> => {
    log4js( "Inicio nuevoComprobante");
    try {
        const abastecimiento: any = await Abastecimiento.findByPk(idAbastecimiento);

        var valor_unitario = (parseFloat(abastecimiento.precioUnitario)/1.18).toFixed(10);
        var igv_unitario =((parseFloat(valor_unitario)*parseFloat(abastecimiento.volTotal))*0.18).toFixed(2);
        var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);
        const numeracion = correlativo.split("-");
        const cadena_qr = [process.env.EMISOR_RUC,tipo, numeracion[0], numeracion[1], igv_unitario, abastecimiento.valorTotal, getTodayDate(), 0, 0]
        const comprobante = Comprobante.build({ 
            ReceptorId:                     receptor.id,
            UsuarioId:                      usuario,
            tipo_comprobante:               tipo,
            numeracion_comprobante:         correlativo,
            tipo_documento_afectado:        tipo_afectado,
            numeracion_documento_afectado:  numeracion_afectado,
            fecha_documento_afectado:       fecha_afectado?fecha_afectado:null,            
            total_gravadas:                 total_gravadas,
            total_igv:                      igv_unitario,
            total_venta:                    abastecimiento.valorTotal,
            monto_letras:                   numbersToLetters(abastecimiento.valorTotal),
            comentario:                     comentario,
            id_abastecimiento:              abastecimiento.idAbastecimiento,
            pistola:                        abastecimiento.pistola,
            codigo_combustible:             abastecimiento.codigoCombustible,
            dec_combustible:                producto,
            volumen:                        abastecimiento.volTotal,
            fecha_abastecimiento:           abastecimiento.fechaHora,
            tiempo_abastecimiento:          abastecimiento.tiempo,
            volumen_tanque:                 abastecimiento.volTanque,
            pago_tarjeta:                   tarjeta,
            pago_efectivo:                  efectivo,
            pago_yape:                      yape,
            placa:                          placa,
            billete:                        billete,
            producto_precio:                abastecimiento.precioUnitario,
            ruc:                            process.env.EMISOR_RUC,
            cadena_para_codigo_qr:          cadena_qr.join('|'),
            codigo_hash:                    '',
            pdf_bytes:                      '',
            url:                            '',
            errors:                         '',            
            Items:[{
                cantidad:           abastecimiento.volTotal,
                valor_unitario:     valor_unitario,
                precio_unitario:    abastecimiento.precioUnitario,
                igv:                igv_unitario,
                descripcion:        producto,
                codigo_producto:    abastecimiento.codigoCombustible,
                placa:              placa,
            }]
        }, {
            include: [
                { model: Item, as: 'Items' }
            ]
          });

        await comprobante.save();

        if(tipo == Constantes.TipoComprobante.NotaCredito){
            Comprobante.update(
                { motivo_documento_afectado: 'Factura dada de baja' },
                { where: { numeracion_comprobante: numeracion_afectado, tipo_comprobante: Constantes.TipoComprobante.Factura } }
            )
        }
                
        log4js( "Fin nuevoComprobante");
        if(comprobante){
            return {
                hasErrorComprobante: false,
                messageComprobante: `Comprobante creado correctamente`,
                comprobante: comprobante
            };
        }else{
            return {
                hasErrorComprobante: true,
                messageComprobante: "nuevoComprobante: " + `Ocurrió un error durante la creación del comprobante`
            };            
        }
        
    } catch (error: any) {
        log4js( "nuevoComprobante: " + error.toString(), 'error');
        log4js( "Fin nuevoComprobante");
        return {
            hasErrorComprobante: true,
            messageComprobante: "nuevoComprobante: " + error.toString(),
        };
    }

}

export const nuevoComprobanteV2 = async (comprobante: IComprobanteAdmin, correlativo: string, receptor: any): Promise<any> => {
    log4js( `Inicio nuevoComprobanteV2(${correlativo}):  ${JSON.stringify(comprobante)}`);
    try {
        var arr_items: any = [] 
        comprobante.items.forEach(({ cantidad, valor, precio, igv, descripcion, codigo_producto, medida}:IComprobanteAdminItem) => {
            arr_items.push({
                cantidad:           cantidad,
                valor_unitario:     valor,
                precio_unitario:    precio,
                igv:                igv,
                descripcion:        descripcion,
                codigo_producto:    codigo_producto,
                medida:             medida,
                placa:              null
            })
        })
        const numeracion = correlativo.split("-");
        const cadena_qr = [process.env.EMISOR_RUC,comprobante.tipo_comprobante, numeracion[0], numeracion[1], comprobante.total_igv, comprobante.total_venta, getTodayDate(), 0, 0]

        const newComprobante = Comprobante.build({ 
            ReceptorId:                     receptor.id,
            UsuarioId:                      comprobante.usuarioId,
            tipo_comprobante:               comprobante.tipo_comprobante,
            numeracion_comprobante:         correlativo,
            tipo_documento_afectado:        comprobante.tipo_comprobante == Constantes.TipoComprobante.NotaCredito?comprobante.tipo_documento_afectado:"",
            numeracion_documento_afectado:  comprobante.tipo_comprobante == Constantes.TipoComprobante.NotaCredito?comprobante.numeracion_documento_afectado:"",
            fecha_documento_afectado:       comprobante.tipo_comprobante == Constantes.TipoComprobante.NotaCredito?comprobante.fecha_documento_afectado:null,           
            total_gravadas:                 comprobante.gravadas,
            total_igv:                      comprobante.total_igv,
            total_venta:                    comprobante.total_venta,
            monto_letras:                   numbersToLetters(comprobante.total_venta),
            comentario:                     comprobante.comentario,
            id_abastecimiento:              1,
            pistola:                        comprobante.pistola,
            codigo_combustible:             comprobante.codigo_combustible,
            dec_combustible:                comprobante.dec_combustible,
            volumen:                        comprobante.volumen,
            fecha_abastecimiento:           getTodayDate(),
            tiempo_abastecimiento:          comprobante.tiempo_abastecimiento,
            volumen_tanque:                 comprobante.volumen_tanque,
            pago_tarjeta:                   comprobante.tarjeta,
            pago_efectivo:                  comprobante.efectivo,
            pago_yape:                      comprobante.yape,
            placa:                          comprobante.placa,
            billete:                        comprobante.billete,
            producto_precio:                comprobante.producto_precio,
            ruc:                            process.env.EMISOR_RUC,
            cadena_para_codigo_qr:          cadena_qr.join('|'),
            codigo_hash:                    '',
            pdf_bytes:                      '',
            url:                            '',
            errors:                         '',
            Items:arr_items
        }, {
            include: [
                { model: Item, as: 'Items' }
            ]
          });

        await newComprobante.save();

        if(comprobante.tipo_comprobante == Constantes.TipoComprobante.NotaCredito){
            Comprobante.update(
                { motivo_documento_afectado: 'Comprobante dado de baja' },
                { where: { numeracion_comprobante: comprobante.numeracion_documento_afectado, tipo_comprobante: comprobante.tipo_documento_afectado } }
            )
        }
        if(comprobante.tipo_comprobante == Constantes.TipoComprobante.Factura){
            log4js( `nuevoComprobante: Inicio Actualizando las notas de despacho asociadas a la factura: ${JSON.stringify(comprobante.items)}`);
            comprobante.items.forEach(({ codigo_producto }:IComprobanteAdminItem) => {
                if(Number.isInteger(codigo_producto)){
                    Comprobante.update(
                        {
                            estado_nota_despacho:           1,
                            comprobante_facturado_nota_despacho:  correlativo,
                            fecha_facturado_nota_despacho:  getTodayDate(),
                        },
                        {
                            where: { id: codigo_producto, tipo_comprobante: Constantes.TipoComprobante.NotaDespacho},
                            returning: true      
                        }
                    );
                }

            }) 
            log4js( `nuevoComprobante: Fin Actualizando las notas de despacho asociadas a la factura `);
        }      
                
        log4js( `Fin nuevoComprobante: ${JSON.stringify(newComprobante)}`);
        if(newComprobante){
            return {
                hasErrorComprobante: false,
                messageComprobante: `Comprobante creado correctamente`,
                comprobante: newComprobante
            };
        }else{
            return {
                hasErrorComprobante: true,
                messageComprobante: "nuevoComprobante: " + `Ocurrió un error durante la creación del comprobante`
            };            
        }
        
    } catch (error: any) {
        log4js( "nuevoComprobante: " + error.toString(), 'error');
        log4js( "Fin nuevoComprobante");
        return {
            hasErrorComprobante: true,
            messageComprobante: "nuevoComprobante: " + error.toString(),
        };
    }

}

export const obtieneComprobante  = async (idComprobante: number): Promise<any> => {
    log4js( "Inicio obtieneComprobante");
    try {
        const comprobante = await Comprobante.findByPk(idComprobante, {
            include: [
                { model: Item, as: 'Items' }
            ]
          }); 
        log4js( "Fin obtieneComprobante: " + JSON.stringify(comprobante));
        if(comprobante){
            return{
                hasErrorObtieneComprobante: false,
                messageObtieneComprobante: `Comprobante obtenido correctamente`,
                comprobante: comprobante              
            } 
        }else{
            return{
                hasErrorObtieneComprobante: true,
                messageObtieneComprobante: `No se obtuvo comprobante`
            }             
        }
    } catch (error: any) {
        log4js( "obtieneComprobante: " + error.toString(), 'error');
        return {
            hasErrorObtieneComprobante: true,
            messageObtieneComprobante: error.toString(),
        };        
    }
    
}

export const actualizarComprobante = async (props: any, idComprobante: number, createOrderMiFact: boolean): Promise<any> => {
    log4js( "Inicio actualizarComprobante");
    try {
        const data = await Comprobante.update(
            {
                cadena_para_codigo_qr:  createOrderMiFact? props.cadena_para_codigo_qr:'',
                codigo_hash:            createOrderMiFact? props.codigo_hash:'',
                pdf_bytes:              createOrderMiFact? props.pdf_bytes:'',
                url:                    createOrderMiFact? props.url:'',
                errors:                 createOrderMiFact? props.errors.substring(0, 255):'',
                enviado:                1
            },
            {
                where: { id: idComprobante },
                returning: true      
            }
        );
        log4js( "Fin actualizarComprobante: " + JSON.stringify(data));
        if(data){
            return {
                hasErrorActualizaComprobante: false,
                messageActualizaComprobante: `Comprobante actualizado correctamente`,
                comprobanteUpdate: data[1][0]
            }                 
        }else{
            return {
                hasErrorActualizaComprobante: true,
                messageActualizaComprobante: `No actualizo ningún comprobante`
            } 
        }                     
    } catch (error: any) {
        log4js( "actualizarComprobante: " + error.toString(), 'error');
        return {
            hasErrorActualizaComprobante: true,
            messageActualizaComprobante: error.toString(),
        };
    }


}

export const generaReporteDiarioRangos = async (fecha_inicio: string, fecha_fin: string): Promise<{ hasError: boolean; message: string; data: any; }> => {
    log4js( "Inicio generaReporteDiarioRangos");
    var data = null;
    var querySelect = 
    'SELECT ' +
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
        await Sqlcn.query(
            querySelect, 
            {
                replacements: { fecha_inicio, fecha_fin },
                type: QueryTypes.SELECT
            }).then((results: any)=>{
                data = results
            });

            log4js( "Fin generaReporteDiarioRangos ");
            
            return {
                hasError: false,
                message: "Reporte generado satisfactoriamente",
                data: data
            };
    } catch (error: any) {
        log4js( "generaReporteDiarioRangos: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteDiarioRangos: " + error.toString(),
            data: data
        };
    }
}

export const generaReporteProductoCombustibleTurno = async (fecha: string): Promise<{ hasError: boolean; message: string; data: any; }> => {
    log4js( "Inicio generaReporteProductoCombustibleTurno");

    const fecha_abastecimiento = fecha + ' 20:00:00.0000000 +00:00'

    var querySelect = 
        'SELECT ROW_NUMBER() OVER (ORDER BY t.turno DESC) AS id, t.turno as Turno, dec_combustible as Producto, ' + 
        'cast(sum(case tipo_comprobante when \'01\' then volumen when \'03\' then volumen when \'52\' then volumen else \'0\' end) as decimal(10,3)) as VolumenVenta, '+
        'cast(sum(case tipo_comprobante when \'50\' then volumen else \'0\' end) as decimal(10,3)) as VolumenDespacho, '+
        'cast(sum(case tipo_comprobante when \'51\' then volumen else \'0\' end) as decimal(10,3)) as VolumenCalibracion, '+
        'cast(sum(convert(float,case tipo_comprobante when \'01\' then total_venta when \'03\' then total_venta when \'52\' then total_venta else \'0\' end)) as decimal(10,2)) as TotalVenta, '+
        'cast(sum(convert(float,case tipo_comprobante when \'50\' then total_venta else \'0\' end)) as decimal(10,2)) as TotalDespacho, '+
        'cast(sum(convert(float,case tipo_comprobante when \'51\' then total_venta else \'0\' end)) as decimal(10,2)) as TotalCalibracion ';
    var queryFrom = 'from Comprobantes c inner join Cierreturnos t on c.CierreturnoId = t.id '
    var queryWhere = 'where ((fecha_emision = DATEADD(day, -1,CAST(:fecha AS DATE)) and fecha_abastecimiento > DATEADD(day, -1,CAST(:fecha_abastecimiento AS datetimeoffset)) and t.turno = \'TURNO1\') or  (fecha_emision = :fecha))';
    var queryGroup = 'group by t.turno, dec_combustible order by t.turno desc;'

    var prepareQuery = querySelect + queryFrom + queryWhere + queryGroup;
    
    var data = null;
    try {
        await Sqlcn.query(
            prepareQuery, 
            {
                replacements: { fecha, fecha_abastecimiento },
                type: QueryTypes.SELECT
            }).then((results: any)=>{
                data = results
            });

            log4js( "Fin generaReporteProductoCombustibleTurno ");
            return {
                hasError: false,
                message: "Reporte generado satisfactoriamente",
                data: data
            };
    } catch (error: any) {
        log4js( "generaReporteProductoCombustibleTurno: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteProductoCombustibleTurno: " + error.toString(),
            data: data
        };
    }
}

export const generaReporteDeclaracionMensual = async (month: string, year: string): Promise<{ hasError: boolean; message: string; data: any; }> => {
    log4js( "Inicio generaReporteDeclaracionMensual");
    var data = null;

    try {
        var query = 
        'select c.tipo_comprobante, r.tipo_documento, r.numero_documento, c.numeracion_comprobante, c.tipo_documento_afectado, c.numeracion_documento_afectado, c.fecha_emision, LEFT(convert(varchar,c.fecha_abastecimiento,108), 8), CAST(c.total_gravadas as decimal(10,2)) as total_gravadas, CAST(c.total_igv as decimal(10,2)) as total_igv, CAST(c.total_venta as decimal(10,2)) as total_venta, c.dec_combustible, c.volumen, c.pistola, c.tiempo_abastecimiento, c.ruc ' + 
        'from Comprobantes c ' +
        'inner join Receptores r on c.ReceptorId = r.id ' +
        'where YEAR(fecha_emision) = :year and MONTH(fecha_emision) = :month and tipo_comprobante in (\'01\',\'03\',\'07\') and c.errors = \'\' ' +
        'order by c.id desc;';

        await Sqlcn.query(
            query, 
            {
                replacements: { year, month },
                type: QueryTypes.SELECT
            }).then((results: any)=>{
                data = results
            });

            log4js( "Fin generaReporteDeclaracionMensual ");
            
            return {
                hasError: false,
                message: "Reporte generado satisfactoriamente",
                data: data
            };
    } catch (error: any) {
        log4js( "generaReporteDeclaracionMensual: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteDeclaracionMensual: " + error.toString(),
            data: data
        };
    }
}

export const generaReporteCierreTurno = async (fecha: string): Promise<{ hasError: boolean; message: string; data: any; }> => {
    log4js( "Inicio generaReporteCierreTurno");
    var data = null;
    try {
        var query = 
        'SELECT c.id as Id, c.turno as Turno, c.isla as Isla, u.nombre as Usuario, RIGHT( CONVERT(DATETIME, c.fecha),8) as Hora, CAST(c.efectivo AS DECIMAL(10,2)) as Efectivo, CAST(c.tarjeta AS DECIMAL(10,2)) as Tarjeta, CAST(c.yape AS DECIMAL(10,2)) as Yape, CAST(c.total AS DECIMAL(10,2)) as Total ' +
        'FROM Cierreturnos c ' +
        'INNER JOIN Usuarios u on c.UsuarioId = u.id ' +
        'where CAST(fecha as DATE) = CAST(:fecha as DATE)';

        await Sqlcn.query(
            query, 
            {
                replacements: { fecha },
                type: QueryTypes.SELECT
            }).then((results: any)=>{
                data = results
            });

            log4js( "Fin generaReporteCierreTurno ");
            
            return {
                hasError: false,
                message: "Reporte generado satisfactoriamente",
                data: data
            };
    } catch (error: any) {
        log4js( "generaReporteCierreTurno: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteCierreTurno: " + error.toString(),
            data: data
        };
    }
}

export const validaComprobanteAbastecimiento = async (idAbastecimiento: string, tipo_comprobante: string): Promise<{ hasError: boolean; message: string; } > => {
    log4js( "Inicio validaComprobanteAbastecimiento");
    if(tipo_comprobante == Constantes.TipoComprobante.NotaCredito){
        log4js( "Fin validaComprobanteAbastecimiento ");
        return {
            hasError: false,
            message: `No se valida abastecimiento para NC`
        };        
    }else{
        const total = await Comprobante.count({
            where: { id_abastecimiento: idAbastecimiento }
        });
        log4js( "Fin validaComprobanteAbastecimiento ");
        return {
            hasError: total != 0,
            message: `Comprobante se encuentra registrado previamente ${total}`
        };
    }

}

export const Comprobante  = Sqlcn.define('Comprobantes', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },   
    tipo_comprobante:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numeracion_comprobante:{
        type: DataTypes.STRING,
        allowNull: true
    },     
    fecha_emision:{
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },   
    tipo_moneda:{
        type: DataTypes.STRING,
        defaultValue: 'PEN'
    },  
    tipo_operacion:{
        type: DataTypes.STRING,
        defaultValue: '0101'
    },  
    tipo_nota:{
        type: DataTypes.STRING,
        allowNull: true
    }, 
    tipo_documento_afectado:{
        type: DataTypes.STRING,
        allowNull: true     
    },
    fecha_documento_afectado:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },       
    numeracion_documento_afectado:{
        type: DataTypes.STRING,
        allowNull: true
    },
    motivo_documento_afectado:{
        type: DataTypes.STRING,
        allowNull: true
    },
    total_gravadas:{
        type: DataTypes.STRING
    },       
    total_igv:{
        type: DataTypes.STRING
    },
    total_venta:{
        type: DataTypes.STRING
    },  
    monto_letras:{
        type: DataTypes.STRING
    },
    cadena_para_codigo_qr:{
        type: DataTypes.STRING
    }, 
    codigo_hash:{
        type: DataTypes.STRING
    }, 
    pdf_bytes:{
        type: DataTypes.STRING
    },
    url:{
        type: DataTypes.STRING
    },     
    errors:{
        type: DataTypes.STRING
    },
    id_abastecimiento:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pistola:{
        type: DataTypes.INTEGER,
        allowNull: false
    },         
    codigo_combustible:{
        type: DataTypes.TEXT('tiny'),
        allowNull: false
    }, 
    dec_combustible:{
        type: DataTypes.STRING,
        allowNull: false
    },                                                               
    volumen:{
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    fecha_abastecimiento:{
        type: DataTypes.DATE,
        allowNull: false
    },    
    tiempo_abastecimiento:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    volumen_tanque:{
        type: DataTypes.BIGINT,
        allowNull: false
    },         
    comentario:{
        type: DataTypes.STRING
    },
    pago_tarjeta:{
        type: DataTypes.FLOAT
    },
    pago_efectivo:{
        type: DataTypes.FLOAT
    },
    pago_yape:{
        type: DataTypes.FLOAT
    },    
    placa:{
        type: DataTypes.STRING
    },
    billete:{
        type: DataTypes.FLOAT
    },
    producto_precio:{
        type: DataTypes.FLOAT
    },
    ruc:{
        type: DataTypes.STRING
    },
    enviado:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    estado_nota_despacho:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    comprobante_nota_despacho:{
        type: DataTypes.STRING
    },    
    fecha_facturado_nota_despacho:{
        type: DataTypes.DATE
    },    
}, {
    timestamps: false
});

Comprobante.hasMany(Item, {
    foreignKey: 'ComprobanteId'
});
Comprobante.belongsTo(Receptor, {
    foreignKey: 'ReceptorId'
});
Comprobante.belongsTo(Usuario, {
    foreignKey: {
        name:'UsuarioId',
        allowNull: false
    }
});
Comprobante.belongsTo(Cierreturno, {
    foreignKey: {
        name:'CierreturnoId',
        allowNull: true
    }
});
Comprobante.belongsTo(Receptor, {
    foreignKey: {
        name:'ReceptorId',
        allowNull: true
    }
});
/*
Receptor.hasMany(Comprobante, {
    foreignKey: 'ReceptorId'
});
*/
Emisor.hasMany(Terminal, {
    foreignKey: 'EmisorId'
});
Terminal.hasMany(Isla, {
    foreignKey: 'TerminalId'
});
Isla.belongsTo(Terminal, {
    foreignKey: {
        name:'TerminalId',
        allowNull: false
    }
});

Isla.hasMany(Pistola, {
    foreignKey: 'IslaId'
});
Login.belongsTo(Usuario, {
    foreignKey: 'UsuarioId'
});
Cierreturno.belongsTo(Cierredia, {
    foreignKey: {
        name:'CierrediaId',
        allowNull: true
    }
});
Cierreturno.belongsTo(Usuario, {
    foreignKey: 'UsuarioId'
});
Usuario.belongsTo(Emisor, {
    foreignKey: {
        name:'EmisorId',
        allowNull: false
    }
});
Gastos.belongsTo(Cierreturno, {
    foreignKey: {
        name:'CierreturnoId',
        allowNull: true
    }
});
Gastos.belongsTo(Usuario, {
    foreignKey: {
        name:'UsuarioId',
        allowNull: false
    }
});
Depositos.belongsTo(Cierreturno, {
    foreignKey: {
        name:'CierreturnoId',
        allowNull: true
    }
});
Depositos.belongsTo(Usuario, {
    foreignKey: {
        name:'UsuarioId',
        allowNull: false
    }
});

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
