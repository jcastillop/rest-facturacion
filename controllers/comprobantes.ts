import { Request, Response } from "express";
import Receptor, { obtieneReceptor } from "../models/receptor";

import { actualizaAbastecimiento } from "../models/abastecimiento";
import { Comprobante, actualizarComprobante, nuevoComprobante, nuevoComprobanteV2, obtieneComprobante, validaComprobanteAbastecimiento } from "../models/comprobante";
import { generaCorrelativo } from "../models/correlativo";
import Cierreturno, { cerrarTurno, obtenerCierreTurno, obtieneCierreTurnoGalonaje, obtieneCierreTurnoTotalProducto, obtieneCierreTurnoTotalSoles } from "../models/cierreturno";

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
                { model: Usuario, required: true }
            ],
            where:  queryWhere,
            order: [
                ['id', 'DESC']
            ],            
            offset: Number(comprobanteParams.offset),
            limit:  5000,
            raw:    true
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

    const { id, limite = 15, desde = 0 } = req.params;

    try {
      
        var queryFilters = []

        if(id == "0"){
            queryFilters = [{ estado_nota_despacho: false }, { tipo_comprobante: Constantes.TipoComprobante.NotaDespacho }]
        }else{
            queryFilters = [{ estado_nota_despacho: false }, { tipo_comprobante: Constantes.TipoComprobante.NotaDespacho }, { '$Receptore.numero_documento$': id }]
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