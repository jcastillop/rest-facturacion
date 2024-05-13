import { Request, Response } from "express";
import Receptor, { obtieneReceptor } from "../models/receptor";

import { actualizaAbastecimiento } from "../models/abastecimiento";
import { Comprobante, actualizarComprobante, getDescuentoPorItem, nuevoComprobante, nuevoComprobanteV2, obtieneComprobante, obtieneSerie, saveComprobanteMaster, validaComprobanteAbastecimiento } from "../models/comprobante";
import { generaCorrelativo } from "../models/correlativo";
import Cierreturno, { cerrarTurno, obtenerCierreTurno, obtieneCierreTurnoGalonaje, obtieneCierreTurnoTotalProducto, obtieneCierreTurnoTotalSoles } from "../models/cierreturno";

import { createOrderApiMiFact } from "../helpers/api-mifact";
import Constantes from "../helpers/constantes";
import { Op } from "sequelize";
import { cerrarDia } from "../models/cierredia";
import Usuario from "../models/usuario";
import Item from "../models/item";
import { IComprobanteMaster, IReceptor } from "../interfaces";


export const generaComprobante = async (req: Request, res: Response) => {

    const { body } = req;
    const serie: string = '001';
    const bCreateOrderMiFact = (body.tipo == Constantes.TipoComprobante.Boleta || body.tipo == Constantes.TipoComprobante.Factura || body.tipo == Constantes.TipoComprobante.NotaCredito)
    var responseMiFact;

    const { hasError, message } = await validaComprobanteAbastecimiento(body.id, body.tipo);

    if(hasError){
        res.json({
            hasError: hasError,
            respuesta: message
        });  

    }else{

        const { hasErrorCorrelativo, messageCorrelativo, correlativo} = await generaCorrelativo(body.tipo, serie, body.prefijo?body.prefijo:"")
        if(hasErrorCorrelativo){ res.json({ hasError: true, respuesta: messageCorrelativo}); return; }
    
        const {hasErrorReceptor, messageReceptor, receptor} = await obtieneReceptor(body.numero_documento?body.numero_documento:0, body.tipo_documento, body.razon_social, body.direccion, body.correo, body.placa);
        if(hasErrorReceptor){ res.json({ hasError: true, respuesta: messageReceptor}); return; }
    
        const {hasErrorComprobante, messageComprobante, comprobante} = await nuevoComprobante(body.id, body.tipo, receptor, correlativo, body.placa, body.usuario, body.producto, body.comentario, body.tipo_afectado, body.numeracion_afectado, body.fecha_afectado, body.tarjeta, body.efectivo, body.yape, body.billete);
        if(hasErrorComprobante){ res.json({ hasError: true, respuesta: messageComprobante}); return; }

        const {hasErrorActualizaAbastecimiento, messageActualizaAbastecimiento} = await actualizaAbastecimiento(body.id, body.tipo);
        if(hasErrorActualizaAbastecimiento){ res.json({ hasError: true, respuesta: messageActualizaAbastecimiento}); return; }

        if(process.env.ENVIOS_ASINCRONOS == '1'){
            res.json({
                hasError: false,
                receptor: receptor,
                comprobante: comprobante,
                respuesta: bCreateOrderMiFact?"Comprobante guardado y enviado a SUNAT":"Comprobante generado"
            }); 
        }else{
            if(bCreateOrderMiFact){
                const {hasErrorMiFact, messageMiFact, response} = await createOrderApiMiFact(comprobante, receptor, body.tipo, correlativo);
                responseMiFact = response;
                if(hasErrorMiFact){ res.json({ hasError: true, respuesta: messageMiFact}); return; }
            }
        
            const {hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate} = await actualizarComprobante(responseMiFact, comprobante.id, bCreateOrderMiFact)
            if(hasErrorActualizaComprobante){ res.json({ hasError: true, respuesta: messageActualizaComprobante}); return; }

            res.json({
                hasError: false,
                receptor: receptor,
                comprobante: comprobanteUpdate,
                respuesta: bCreateOrderMiFact?"Comprobante guardado y enviado a SUNAT":"Comprobante generado"
            });             

        }
    }
}

export const generaComprobanteV2 = async (req: Request, res: Response) => {

    const { tipo_comprobante, prefijo, Receptor } = req.body;
    const serie: string = '002';
    const bCreateOrderMiFact = (tipo_comprobante == Constantes.TipoComprobante.Boleta || tipo_comprobante == Constantes.TipoComprobante.Factura || tipo_comprobante == Constantes.TipoComprobante.NotaCredito)
    var responseMiFact;

    const { hasErrorCorrelativo, messageCorrelativo, correlativo} = await generaCorrelativo(tipo_comprobante, serie, prefijo?prefijo:"")
    if(hasErrorCorrelativo){ res.json({ hasError: true, respuesta: messageCorrelativo}); return; }

    const {hasErrorReceptor, messageReceptor, receptor} = await obtieneReceptor(Receptor.numero_documento, Receptor.tipo_documento, Receptor.razon_social, Receptor.direccion, Receptor.correo, Receptor.placa);
    if(hasErrorReceptor){ res.json({ hasError: true, respuesta: messageReceptor}); return; }

    const {hasErrorComprobante, messageComprobante, comprobante} = await nuevoComprobanteV2(req.body, correlativo, receptor);
    if(hasErrorComprobante){ res.json({ hasError: true, respuesta: messageComprobante}); return; }

    if(process.env.ENVIOS_ASINCRONOS == '1'){
        res.json({
            hasError: false,
            receptor: receptor,
            comprobante: comprobante,
            respuesta: bCreateOrderMiFact?"Comprobante guardado y enviado a SUNAT":"Comprobante generado"
        });         
    }else{
        if(bCreateOrderMiFact){
            const {hasErrorMiFact, messageMiFact, response} = await createOrderApiMiFact(comprobante, receptor, tipo_comprobante, correlativo);
            responseMiFact = response;
            if(hasErrorMiFact){ res.json({ hasError: true, respuesta: messageMiFact}); return; }
        }
    
        const {hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate} = await actualizarComprobante(responseMiFact, comprobante.id, bCreateOrderMiFact)

        if(hasErrorActualizaComprobante){ res.json({ hasError: true, respuesta: messageActualizaComprobante}); return; }

        res.json({
            hasError: false,
            receptor: receptor,
            comprobante: comprobanteUpdate,
            respuesta: bCreateOrderMiFact?"Comprobante guardado y enviado a SUNAT":"Comprobante generado"
        });        
    }
    

    



}

export const comprobanteNuevo = async (req: Request, res: Response) => {

    const { billing: { cliente, tipo_comprobante, tipo_facturacion, numeracion_comprobante,fecha_emision, fecha_actual, total_gravadas, total_igv, total_venta, pago_tarjeta, pago_efectivo, pago_yape, usuario, items, tipo_documento_afectado, numeracion_documento_afectado, fecha_documento_afectado, id_abastecimiento } } = req.body;
    const { client: { tipo_documento, numero_documento, razon_social, direccion, correo, placa } } = req.body;

    const { hasError:errorAbastecimiento, message: messageAbastecimiento } = await validaComprobanteAbastecimiento(id_abastecimiento, tipo_comprobante);

    if(errorAbastecimiento){
        res.json({
            hasError: errorAbastecimiento,
            messsage: messageAbastecimiento
        });  

    }else{

        const { serie, hasError, message } = await obtieneSerie( tipo_comprobante, tipo_facturacion )
        if(hasError){ res.json({ hasError: true, respuesta: message}); return; }
    
        const { hasErrorCorrelativo, messageCorrelativo, correlativo} = await generaCorrelativo(tipo_comprobante, serie)
        if(hasErrorCorrelativo){ res.json({ hasError: true, respuesta: messageCorrelativo}); return; }
    
        const {hasErrorReceptor, messageReceptor, receptor} = await obtieneReceptor(numero_documento, tipo_documento, razon_social, direccion, correo, placa);
        if(hasErrorReceptor){ res.json({ hasError: true, respuesta: messageReceptor}); return; }    
    
    
        const billing : IComprobanteMaster = {
            cliente:(receptor as unknown as IReceptor).id_receptor,
            numeracion_comprobante: correlativo,
            tipo_documento_afectado: tipo_comprobante == Constantes.TipoComprobante.NotaCredito ? tipo_documento_afectado : "",
            numeracion_documento_afectado: tipo_comprobante == Constantes.TipoComprobante.NotaCredito ? numeracion_documento_afectado : "",
            fecha_documento_afectado: tipo_comprobante == Constantes.TipoComprobante.NotaCredito ? fecha_documento_afectado : null,        
            tipo_comprobante,
            fecha_emision,
            total_gravadas,
            total_igv,
            total_venta,
            pago_tarjeta,
            pago_efectivo,
            pago_yape,
            placa,
            UsuarioId: usuario,
            id_abastecimiento,
            ruc: process.env.EMISOR_RUC,
            ReceptorId:receptor?((receptor as any).id):0,
            items,
            pistola: 0,
            codigo_combustible: '',
            dec_combustible: '',
            volumen: 0,
            fecha_abastecimiento: fecha_emision,
            tiempo_abastecimiento: 0,
            volumen_tanque: 0
        }
    
    
        const { comprobante } = await saveComprobanteMaster(billing);
    
        if(comprobante){
    
            const {hasErrorActualizaAbastecimiento, messageActualizaAbastecimiento} = await actualizaAbastecimiento(id_abastecimiento, tipo_comprobante);
            if(hasErrorActualizaAbastecimiento){ res.json({ hasError: true, respuesta: messageActualizaAbastecimiento}); return; }  
                  
            res.json({
                messsage: 'Comprobante almacenado correctamente ',
                comprobante: comprobante,
                hasError:false
            }); 
    
        }else{
            res.json({
                messsage: 'Ocurrió un error durante la creación del comprobante',
                comprobante: null,
                hasError:true
            }); 
        } 
    }

}

export const modificaComprobante = async (req: Request, res: Response) => {

    const { body } = req;

    const bCreateOrderMiFact = (body.tipo == Constantes.TipoComprobante.Boleta || body.tipo == Constantes.TipoComprobante.Factura || body.tipo == Constantes.TipoComprobante.NotaCredito)
    var responseMiFact;

    const correlativo = body.correlativo;

    const {hasErrorReceptor, messageReceptor, receptor} = await obtieneReceptor(body.numero_documento?body.numero_documento:0, body.tipo_documento, body.razon_social, body.direccion, body.correo, body.placa);
    if(hasErrorReceptor){ res.json({ hasError: true, respuesta: messageReceptor}); return; }

    const {hasErrorObtieneComprobante, messageObtieneComprobante, comprobante} = await obtieneComprobante(body.id_comprobante)
    if(hasErrorObtieneComprobante){ res.json({ hasError: true, respuesta: messageObtieneComprobante}); return; }    

    if(bCreateOrderMiFact){
        const {hasErrorMiFact, messageMiFact, response} = await createOrderApiMiFact(comprobante, receptor, body.tipo, correlativo);
        responseMiFact = response;
        if(hasErrorMiFact){ res.json({ hasError: true, respuesta: messageMiFact}); return; }
    }    

    const {hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate} = await actualizarComprobante(responseMiFact, comprobante.id, bCreateOrderMiFact)
    if(hasErrorActualizaComprobante){ res.json({ hasError: true, respuesta: messageActualizaComprobante}); return; }    

    const {hasErrorActualizaAbastecimiento, messageActualizaAbastecimiento} = await actualizaAbastecimiento(body.id, body.tipo);
    if(hasErrorActualizaAbastecimiento){ res.json({ hasError: true, respuesta: messageActualizaAbastecimiento}); return; }    
    
    res.json({
        hasError: false,
        receptor: receptor,
        comprobante: comprobanteUpdate,
        respuesta: bCreateOrderMiFact?"Comprobante guardado y enviado a SUNAT":"Comprobante generado"
    }); 

}
interface ComprobanteParams {
    idUsuario?: number;
    idReceptor?: number;
    idCierreTurno?: number;
    desde?:Date;
    hasta?:Date;
    limit?: number;
    offset?: number;
}

export const historicoComprobantes = async (req: Request, res: Response) => {

    const comprobanteParams: ComprobanteParams = req.query;

    const queryAnd = [];

    var queryWhere = { };

    const usuario: any = await Usuario.findByPk(comprobanteParams.idUsuario,{ raw: true });

    if(usuario){
        if(usuario.rol == 'ADMIN_ROLE'){
            queryAnd.push({ numeracion_comprobante: { [Op.ne]: null } });
        }else if(usuario.rol == 'USER_ROLE'){
            queryAnd.push({ UsuarioId: comprobanteParams.idUsuario });
            queryAnd.push({ CierreturnoId: null });
        }else{
            queryAnd.push({ CierreturnoId: { [Op.ne]: null } });
        }
    
        queryWhere = { [Op.and] : queryAnd }
    
        const data: any = await Comprobante.findAndCountAll({
            include: [
                { model: Receptor, required: true },
                { model: Cierreturno, required: false },
                { model: Usuario, required: true },
                { model: Item, required: true }
            ],
            where:  queryWhere,
            order: [
                ['id', 'DESC']
            ],            
            offset: Number(comprobanteParams.offset),
            limit:  5000
        });
    
        res.json({
            total: data.count, 
            comprobantes: data.rows
        });
    }else{
        res.json({
            total: 0, 
            comprobantes: null
        });
    }
}

export const cierreTurno = async (req: Request, res: Response) => {

    const { body } = req;

    try {
        const cierre = await cerrarTurno({sessionID: body.session, turno: body.turno, isla: body.isla, efectivo: body.efectivo, tarjeta: body.tarjeta, yape: body.yape})

        res.json({
            cierre
        });        
    } catch (error) {
        res.json({
            error
        });          
    }
}

export const createCierreDia = async (req: Request, res: Response) => {

    const { body } = req;

    try {
        const cierre = await cerrarDia({sessionID: body.session, fecha: body.fecha })

        res.json({
            cierre
        });        
    } catch (error) {
        res.json({
            error
        });          
    }
}

export const listaTurnosPorCerrar = async (req: Request, res: Response) => {

    try {
        const cierre = await obtenerCierreTurno()

        res.json(cierre);  
             
    } catch (error) {
        res.json({
            error
        });          
    }
}

export const historicoCierres = async (req: Request, res: Response) => {

    const { idUsuario } = req.query;

    const data: any = await Cierreturno.findAll({      
        where: { UsuarioId: idUsuario },
        order: [
            ['id', 'DESC']
        ],
        limit: 5
    });
    
    res.json(data);     
    
}

export const cierreTurnoGalonaje = async (req: Request, res: Response) => {

    const { idUsuario } = req.query;
    const data = await obtieneCierreTurnoGalonaje( idUsuario?idUsuario.toString():"" );
    res.json(data);   

}

export const cierreTurnoTotalProducto = async (req: Request, res: Response) => {

    const { idUsuario } = req.query;
    const data = await obtieneCierreTurnoTotalProducto( idUsuario?idUsuario.toString():"" );
    res.json(data);   

}

export const cierreTurnoTotalSoles = async (req: Request, res: Response) => {

    const { idUsuario } = req.query;
    const data = await obtieneCierreTurnoTotalSoles( idUsuario?idUsuario.toString():"" );
    res.json(data);   

}

export const getComprobante = async (req: Request, res: Response) => {

    const { id } = req.query;

    try {
        const comprobante: any = await obtieneComprobante(id?+id:0);

        res.json({
            comprobante
        });        
    } catch (error) {
        res.json({
            error
        });          
    }    
}

export const getNotasDespacho = async (req: Request, res: Response) => {

    const { id, rs, fecIni, fecFin, limite = 2000, desde = 0 } = req.query;

    try {
      
                
        var queryFilters:any[] = []
        queryFilters = [{ estado_nota_despacho: false }, { tipo_comprobante: Constantes.TipoComprobante.NotaDespacho }]

        if(id){
            queryFilters.push({ '$Receptore.numero_documento$': id })
        }
        if(rs){
            queryFilters.push({ '$Receptore.razon_social$': { [Op.like]: '%' + rs + '%'} })
        }
        if(fecIni){
            queryFilters.push({ fecha_emision: { [Op.gte]: fecIni }  })
        }
        if(fecFin){
            queryFilters.push({ fecha_emision: { [Op.lte]: fecFin }  })
        }          

        const data: any = await Comprobante.findAndCountAll({
            include: [
                { 
                    model: Receptor,
                    as: 'Receptore'
                }
            ],              
            where:  { [Op.and] : queryFilters },
            offset: Number(desde),
            limit:  Number(limite),
            raw:    true,
        }  );
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count, 
            comprobantes: data.rows
        });

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
}

export const obtieneDescuentos = async (req: Request, res: Response) => {

    const { items = [], codigo_producto = '', cliente:{ numero_documento = '' }} = req.body;

    const { hasError, message, descuento } = await getDescuentoPorItem( numero_documento, codigo_producto, items );

    res.json({
        descuento,
        hasError: hasError,
        message: message
    });     

}