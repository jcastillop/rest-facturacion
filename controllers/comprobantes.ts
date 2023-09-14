import { Request, Response } from "express";

import Item from "../models/item";
import Receptor, { obtieneReceptor } from "../models/receptor";

import { actualizaAbastecimiento } from "../models/abastecimiento";
import { Comprobante, actualizarComprobante, nuevoComprobante, obtieneComprobante, validaComprobanteAbastecimiento } from "../models/comprobante";
import { generaCorrelativo } from "../models/correlativo";
import Cierreturno, { cerrarTurno, obtenerCierreTurno } from "../models/cierreturno";

import { createOrderApiMiFact } from "../helpers/api-mifact";
import Constantes from "../helpers/constantes";
import { Op } from "sequelize";
import { cerrarDia } from "../models/cierredia";
import Usuario from "../models/usuario";


export const generaComprobante = async (req: Request, res: Response) => {

    const { body } = req;
    const serie: string = '001';
    const bCreateOrderMiFact = (body.tipo == Constantes.TipoComprobante.Boleta || body.tipo == Constantes.TipoComprobante.Factura || body.tipo == Constantes.TipoComprobante.NotaCredito)
    var responseMiFact;

    const { hasError, message } = await validaComprobanteAbastecimiento(body.id);

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
        
        if(bCreateOrderMiFact){
            const {hasErrorMiFact, messageMiFact, response} = await createOrderApiMiFact(comprobante, receptor, body.tipo, correlativo);
            responseMiFact = response;
            if(hasErrorMiFact){ res.json({ hasError: true, respuesta: messageMiFact}); return; }
        }
    
        const {hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate} = await actualizarComprobante(responseMiFact, comprobante.id, bCreateOrderMiFact)
        if(hasErrorActualizaComprobante){ res.json({ hasError: true, respuesta: messageActualizaComprobante}); return; }
    
        const {hasErrorActualizaAbastecimiento, messageActualizaAbastecimiento} = await actualizaAbastecimiento(body.id);
        if(hasErrorActualizaAbastecimiento){ res.json({ hasError: true, respuesta: messageActualizaAbastecimiento}); return; }
        
        res.json({
            hasError: false,
            receptor: receptor,
            comprobante: comprobanteUpdate,
            respuesta: bCreateOrderMiFact?"Comprobante guardado y enviado a SUNAT":"Comprobante generado"
        }); 

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
    
        const queryParams = {
            include: [
                { model: Receptor, required: true },
                { model: Cierreturno, required: false },
                { model: Usuario, required: true }
            ],
            where:  queryWhere,
            offset: Number(comprobanteParams.offset),
            limit:  Number(comprobanteParams.limit),
            raw:    true
        }
    
        const data: any = await Comprobante.findAndCountAll(
            queryParams
        );
    
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
        const cierre = await cerrarTurno({sessionID: body.session, fecha: body.fecha, turno: body.turno, isla: body.isla, efectivo: body.efectivo, tarjeta: body.tarjeta, yape: body.yape})

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

    const { body } = req;

    try {
        const cierre = await obtenerCierreTurno({fecha: body.fecha})

        res.json(cierre);  
             
    } catch (error) {
        res.json({
            error
        });          
    }
}