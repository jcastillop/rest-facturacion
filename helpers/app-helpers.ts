import { Comprobante, actualizarComprobante } from "../models/comprobante";
import Item from "../models/item";
import Receptor from "../models/receptor";
import { createOrderApiMiFact } from "./api-mifact";
import Constantes from "./constantes";

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