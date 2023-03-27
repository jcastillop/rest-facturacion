import { Request, Response } from "express";
import { crearFactura,syncWriteFile,asyncWriteFile } from "../helpers";
import { nuevoComprobante, generaCorrelativo } from "../models";

export const generaComprobante = async (req: Request, res: Response) => {

    const { body } = req;
    
    //Obtiene correlativo
    const correlativo = await generaCorrelativo(body.tipo,'001')
    //Completar la información requerida en un modelo 
    // TODO: registro receptor
    // TODO: registro de correo de cliente (opcional)
    const comprobante = await nuevoComprobante(body.id, body.tipo, correlativo);
    //Completar la información de la factura 
    const factura = crearFactura(comprobante);

    const arrFile = [process.env.EMISOR_RUC , body.tipo, correlativo]

    const file = arrFile.join('-') + '.xml'

    asyncWriteFile(file, factura);
  
    //TODO: Firma digital

    res.json({
        file
    });

    
}