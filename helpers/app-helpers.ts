import { Op, literal, where } from "sequelize";
import { IReceptor, IComprobanteAdmin } from "../interfaces";
import { Comprobante, actualizarComprobante, nuevoComprobante, nuevoComprobanteV2 } from "../models/comprobante";
import { generaComprobanteFirstStep, generaCorrelativo } from "../models/correlativo";
import Item from "../models/item";
import Receptor, { obtieneReceptor } from '../models/receptor';
import { createOrderApiMiFact } from "./api-mifact";
import Constantes from "./constantes";
import { log4js } from "./log4js";
import ReceptorPlaca from "../models/receptorplaca";
import sequelize from "sequelize";
import { RollBackAbastecimiento } from "../models/abastecimiento";

export const procesarComprobantes = async() => {    
    log4js( "Inicio procesarComprobantes");
    const pendientes = await Comprobante.findAll({ 
        include: [
            { model: Item, as: 'Items' }
        ],    
        where: { enviado: 0, tipo_comprobante:[Constantes.TipoComprobante.Factura, Constantes.TipoComprobante.Boleta, Constantes.TipoComprobante.NotaCredito] } 
    });
    log4js(pendientes);
    pendientes.every(async (comprobante: any)=>{
        const receptor = await Receptor.findByPk(comprobante.ReceptorId,{ raw: true });
        log4js( "Receptor");
        log4js(receptor);
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


    if(hasErrorCorrelativo || hasErrorComprobante){
        log4js( "Rollback comprobante con abastecimiento " + id_abastecimiento.toString());
        await RollBackAbastecimiento(id_abastecimiento.toString(),tipo_comprobante )
    }

    return comprobante
    log4js( "Inicio automatismoGenerarComprobantes");
}

export const automatismoObtenerReceptor = async(codigo_combustible: string):Promise<{ receptor: any; receptor_placa:any }> => {
    log4js( "Inicio automatismoObtenerReceptor " + codigo_combustible);
    var receptor = null
    const receptor_placa:any = await ReceptorPlaca.findOne({ 
        where: [
            { ProductoId: codigo_combustible}, 
            { consumo_actual: { [Op.lt]: sequelize.col('consumo_promedio') } }
        ], 
        order: [ ['consumo_actual', 'ASC'] ], 
        limit: 1, 
        raw: true 
    })
    log4js( "Receptor obtenido " + receptor_placa);
    if(receptor_placa){
        const id_receptor = receptor_placa.ReceptorId
        receptor = await Receptor.findOne({ where: { id: id_receptor }});
        log4js( "Fin automatismoObtenerReceptor " + codigo_combustible);
    }

    return{
        receptor, receptor_placa
    }

}

export const automatismosCambiarComprobantesInternos = async() => {
    log4js( "Inicio cambiarComprobantesInternos");
    const interno: any = await Comprobante.findOne({ 
        include: [
            { model: Item, as: 'Items' }
        ],    
        where: { enviado: 0, tipo_comprobante: Constantes.TipoComprobante.Interno },
        order: [ ['id', 'ASC'] ], 
        limit: 1, 
        raw: true         
    });

    if(interno){
        log4js( "Inicio: " + interno.numeracion_comprobante);
        const serie: string = '002';
        const emisor_id = +process.env.AUTOAMTIC_EMISOR_ID!
        var cod_correlativo = ""
        var successComprobante = true
    
        const { receptor, receptor_placa } = await automatismoObtenerReceptor(interno.codigo_combustible);
    
        if(receptor && receptor_placa){
            const { hasErrorCorrelativo, messageCorrelativo, correlativo} =await generaCorrelativo(Constantes.TipoComprobante.NotaDespacho, serie)
            const { hasErrorComprobante, messageComprobante, comprobante} = await nuevoComprobante(interno.id_abastecimiento, Constantes.TipoComprobante.NotaDespacho, receptor, correlativo, receptor_placa.placa, emisor_id, interno.dec_combustible, interno.numeracion_comprobante, "", "", "", 0, interno.pago_efectivo, 0, 0);
            cod_correlativo = correlativo
            successComprobante = !hasErrorCorrelativo && !hasErrorComprobante
            log4js( "cambiarComprobantesInternos: " + messageComprobante);
        }else{
            const { hasErrorCorrelativo, messageCorrelativo, correlativo} =await generaCorrelativo(Constantes.TipoComprobante.Boleta, serie, "B")
            const { hasErrorComprobante, messageComprobante, comprobante} = await nuevoComprobante(interno.id_abastecimiento, Constantes.TipoComprobante.Boleta, { id: process.env.AUTOAMTIC_RECEPTOR_ID }, correlativo, "", emisor_id, interno.dec_combustible, interno.numeracion_comprobante, "", "", "", 0, interno.pago_efectivo, 0, 0);
            successComprobante = !hasErrorCorrelativo && !hasErrorComprobante
            log4js( "cambiarComprobantesInternos: " + messageComprobante);
        }
    
        if(successComprobante){
            const tot_venta = interno.total_venta
            const comprobante = await Comprobante.update({ enviado: 1, comentario: cod_correlativo },{where: { id: interno.id },returning: true});            
            log4js(JSON.stringify(comprobante));
            log4js( "cambiarComprobantesInternos: comprobante iterno creado " + cod_correlativo);
            if(receptor_placa){
                const id_receptor_placa = receptor_placa.id
                const new_receptor_placa = await ReceptorPlaca.increment('consumo_actual',{ by: tot_venta, where: { id: id_receptor_placa }})
                log4js( "Actualizando consumo del receptor placa " + new_receptor_placa);
            }
        }
        log4js( "Fin: " + interno.numeracion_comprobante);    
    }

    log4js( "Fin cambiarComprobantesInternos");
}

export const automatismosReiniciarConsumoActual = async() =>{
    log4js( "Inicio automatismosReiniciarConsumoActual");
    await ReceptorPlaca.update({ consumo_actual: 0 },{ where: { estado: 1 } })
    log4js( "Fin automatismosReiniciarConsumoActual");
}