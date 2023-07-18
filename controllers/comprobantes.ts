import { Request, Response } from "express";
import { makeXMLFactura, syncWriteFile, asyncWriteFile } from "../helpers";
import { nuevoComprobante, generaCorrelativo, actualizaAbastecimiento, Comprobante, actualizarComprobante } from "../models";
import { signXml } from '../helpers/digital-signature';
import Receptor, { obtieneReceptor } from "../models/receptor";
import { createOrderApiMiFact } from "../helpers/api-mifact";
import Item from "../models/item";

export const generaComprobante = async (req: Request, res: Response) => {

    const { body } = req;
    
    const serie: string = '001';
    var actualizar;
    //Obtiene correlativo
    try {
        const correlativo = await generaCorrelativo(body.tipo, serie)
        const receptor = await obtieneReceptor(body.numero_documento, body.tipo_documento, body.razon_social, body.direccion, body.correo);
        const comprobante_insert = await nuevoComprobante(body.id, body.tipo, receptor, correlativo, body.placa, body.usuario);
        const factura = await createOrderApiMiFact(comprobante_insert, receptor, body.tipo, correlativo);
        const comprobante = await actualizarComprobante(factura, comprobante_insert.id)
        if(!factura.response.errors){
            actualizar = await actualizaAbastecimiento(body.id);
        }
        //const actualizar = await actualizaAbastecimiento(body.id);
        res.json({
            receptor,
            factura,
            comprobante
        });          
    } catch (error) {
        res.json({
            error
        });          
    }
}

export const obtieneComprobante = async (req: Request, res: Response) => {

    const comprobantes = await Comprobante.findAll({
        include: [
            { model: Item, as: 'Items' },
            { model: Receptor }
        ],
        order: [
          ["id", "DESC"],
        ],
      });
    
    res.json({
        comprobantes
    });  

    

    

}