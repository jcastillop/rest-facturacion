import { DataTypes, IntegerDataType, QueryTypes, Sequelize } from "sequelize";
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


export const nuevoComprobante = async (idAbastecimiento: string, tipo:string, receptor:any, correlativo: string, placa: string, usuario: number, producto: string, comentario: string, tipo_afectado: string, numeracion_afectado: string, fecha_afectado: string, tarjeta: number = 0, efectivo: number = 0, yape: number = 0, billete: number = 0): Promise<any> => {
    log4js( "Inicio nuevoComprobante");
    try {
        const abastecimiento: any = await Abastecimiento.findByPk(idAbastecimiento);

        var valor_unitario = (parseFloat(abastecimiento.precioUnitario)/1.18).toFixed(10);
        var igv_unitario =((parseFloat(valor_unitario)*parseFloat(abastecimiento.volTotal))*0.18).toFixed(2);
        var total_gravadas = (parseFloat(valor_unitario) * abastecimiento.volTotal).toFixed(2);
    
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
                errors:                 createOrderMiFact? props.errors:'',
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

export const generaReporteProductoCombustible = async (fecha: string): Promise<{ hasError: boolean; message: string; data: any; }> => {
    log4js( "Inicio generaReporteProductoCombustible");
    var data = null;
    try {
        await Sqlcn.query(
            'SELECT fecha_emision as Fecha, dec_combustible as Producto, cast(sum(volumen) as decimal(10,3)) as Volumen, sum(convert(float,total_venta)) as Total  from Comprobantes where fecha_emision = :fecha  group by fecha_emision, dec_combustible;', 
            {
                replacements: { fecha },
                type: QueryTypes.SELECT
            }).then((results: any)=>{
                data = results
            });

            log4js( "Fin generaReporteProductoCombustible ");
            
            return {
                hasError: false,
                message: "Reporte generado satisfactoriamente",
                data: data
            };
    } catch (error: any) {
        log4js( "generaReporteProductoCombustible: " + error.toString(), 'error');
        return {
            hasError: true,
            message: "generaReporteProductoCombustible: " + error.toString(),
            data: data
        };
    }
}

export const generaReporteProductoCombustibleTurno = async (fecha: string, turnos: string, usuarios: string): Promise<{ hasError: boolean; message: string; data: any; }> => {
    log4js( "Inicio generaReporteProductoCombustibleTurno");

    const array: string[] = turnos.split(',');
    const arrUsuarios: string[] = usuarios.split(',');

    var querySelect = 'SELECT t.turno as Turno, dec_combustible as Producto, cast(sum(volumen) as decimal(10,3)) as Volumen, sum(convert(float,total_venta)) ';
    var queryWhere = 'where ((fecha_emision = DATEADD(day, -1,CAST(:fecha AS DATE)) and t.turno = \'TURNO1\') or  (fecha_emision = :fecha)) and t.turno in( :array ) ';
    var queryGroup = 'group by t.turno, dec_combustible;'
    
    if(arrUsuarios.length > 0){
        querySelect = 'SELECT t.turno as Turno, dec_combustible as Producto, cast(sum(volumen) as decimal(10,3)) as Volumen, sum(convert(float,total_venta)) ';
        queryWhere = 'where ((fecha_emision = DATEADD(day, -1,CAST(:fecha AS DATE)) and t.turno = \'TURNO1\') or  (fecha_emision = :fecha)) and t.turno in( :array ) ';
        queryGroup = 'group by t.turno, dec_combustible;'
    }

    var prepareQuery = querySelect + queryWhere + queryGroup;

    var data = null;
    try {
        await Sqlcn.query(
            prepareQuery, 
            {
                replacements: { fecha, array },
                type: QueryTypes.SELECT
            }).then((results: any)=>{
                data = results
            });

            log4js( "Fin generaReporteProductoCombustibleTurno ");
            console.log(data);
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

export const validaComprobanteAbastecimiento = async (idAbastecimiento: string): Promise<{ hasError: boolean; message: string; } > => {
    log4js( "Inicio validaComprobanteAbastecimiento");
    const total = await Comprobante.count({
        where: { id_abastecimiento: idAbastecimiento }
    });
    log4js( "Fin validaComprobanteAbastecimiento ");
    return {
        hasError: total != 0,
        message: `Comprobante se encuentra registrado previamente ${total}`
    };
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
    }                              
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

(async () => {
    await Sqlcn.sync({ force: false });
    // Code here
  })();
