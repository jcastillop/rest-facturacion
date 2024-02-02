import { literal, where } from "sequelize";
import { IReceptor, IComprobanteAdmin } from "../interfaces";
import { Comprobante, actualizarComprobante, nuevoComprobante, nuevoComprobanteV2 } from "../models/comprobante";
import { generaComprobanteFirstStep, generaCorrelativo } from "../models/correlativo";
import Item from "../models/item";
import Receptor, { obtieneReceptor } from '../models/receptor';
import { createOrderApiMiFact } from "./api-mifact";
import Constantes from "./constantes";
import { log4js } from "./log4js";

export const procesarComprobantes = async() => {    

    const pendientes = await Comprobante.findAll({ 
        include: [
            { model: Item, as: 'Items' }
        ],    
        where: { enviado: 0, tipo_comprobante:[Constantes.TipoComprobante.Factura, Constantes.TipoComprobante.Boleta, Constantes.TipoComprobante.NotaCredito] } 
    });
    pendientes.every(async (comprobante: any)=>{
        const receptor = await Receptor.findByPk(comprobante.ReceptorId,{ raw: true });
        const {hasErrorMiFact, messageMiFact, response} = await createOrderApiMiFact(comprobante, receptor, comprobante.tipo_comprobante, comprobante.numeracion_comprobante);
        if(!hasErrorMiFact){
            const {hasErrorActualizaComprobante, messageActualizaComprobante, comprobanteUpdate} = await actualizarComprobante(response, comprobante.id, true)
        }
    })
}

export const automatismoGenerarComprobantes = async(id_abastecimiento: number, id_usuario: number, producto: string, monto: number) => {
    log4js( "Inicio automatismoGenerarComprobantes");
    const serie: string = '002';
    const tipo_comprobante = Constantes.TipoComprobante.Interno
    const prefijo = 'I'

    const { hasErrorCorrelativo, messageCorrelativo, correlativo, correlativo_resultado, receptor_id, resultado} = await generaComprobanteFirstStep(id_abastecimiento, tipo_comprobante, serie, prefijo, 0, '0')

    const {hasErrorComprobante, messageComprobante, comprobante} = await nuevoComprobante(id_abastecimiento.toString(), tipo_comprobante, { id: process.env.AUTOAMTIC_RECEPTOR_ID }, correlativo, "", id_usuario, producto, "", "", "", "", 0, monto, 0, 0);
    log4js( "Inicio automatismoGenerarComprobantes");
}

export const automatismoObtenerReceptor = async() => {
    return await Receptor.findOne({ where: { enviado: 0 }, order: literal('rand()'), limit: 1, raw: true });
}

export const automatismosCambiarComprobantesInternos = async() => {
    log4js( "Inicio cambiarComprobantesInternos");
    const internos = await Comprobante.findAll({ 
        include: [
            { model: Item, as: 'Items' }
        ],    
        where: { enviado: 0, tipo_comprobante: Constantes.TipoComprobante.Interno } 
    });

    internos.every(async (interno: any)=>{
        log4js( "Loop inicio cambiarComprobantesInternos: " + JSON.stringify(interno));
        const serie: string = '002';
        const emisor_id = +process.env.AUTOAMTIC_EMISOR_ID!
        const receptor:any = await Receptor.findOne({ where: { automatismos: 1 }, order: literal('rand()'), limit: 1, raw: true });
        const { hasErrorCorrelativo, messageCorrelativo, correlativo} =await generaCorrelativo(Constantes.TipoComprobante.Factura, serie, "F")
        const {hasErrorComprobante, messageComprobante, comprobante} = await nuevoComprobante(interno.id_abastecimiento, Constantes.TipoComprobante.Factura, receptor, correlativo, receptor.placa, emisor_id, interno.dec_combustible, "", "", "", "", 0, interno.pago_efectivo, 0, 0);
        if(!hasErrorCorrelativo && !hasErrorComprobante){
            const comprobante = await Comprobante.update({ enviado: 1, comentario: correlativo },{where: { id: interno.id },returning: true});            
            log4js(JSON.stringify(comprobante));
        }
        log4js( "Loop fin cambiarComprobantesInternos: " + messageComprobante);
    })    
    log4js( "Fin cambiarComprobantesInternos");
}