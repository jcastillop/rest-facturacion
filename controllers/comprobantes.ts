import { Request, Response } from "express";
import { makeXMLFactura, syncWriteFile, asyncWriteFile } from "../helpers";
import { nuevoComprobante, generaCorrelativo } from "../models";
import { signXml } from '../helpers/digital-signature';

export const generaComprobante = async (req: Request, res: Response) => {

    const { body } = req;
    const serie: string = '001';
    //Obtiene correlativo
    const correlativo = await generaCorrelativo(body.tipo,serie)
    //Completar la información requerida en un modelo 
    // TODO: registro receptor
    // TODO: registro de correo de cliente (opcional)
    const comprobante = await nuevoComprobante(body.id, body.tipo, correlativo);
    //Completar la información de la factura 
    const facturaXML = makeXMLFactura(comprobante);
    //Firmar digitalmente
    //const facturaXMLSign = signXml(facturaXML);
    //Guardar el documento
    const file = [process.env.EMISOR_RUC , body.tipo, correlativo].join('-') + '.xml'
    asyncWriteFile(file, facturaXML);
    //TODO: Firma digital
    res.json({
        file
    });  
}