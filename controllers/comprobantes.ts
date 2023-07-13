import { Request, Response } from "express";
import { makeXMLFactura, syncWriteFile, asyncWriteFile } from "../helpers";
import { nuevoComprobante, generaCorrelativo, actualizaAbastecimiento } from "../models";
import { signXml } from '../helpers/digital-signature';
import { obtieneReceptor } from "../models/receptor";
import { createOrderApiMiFact } from "../helpers/api-mifact";

export const generaComprobante = async (req: Request, res: Response) => {

    const { body } = req;
    
    const serie: string = '001';
    var actualizar;
    //Obtiene correlativo

    try {
        const correlativo = await generaCorrelativo(body.tipo, serie)
        const receptor = await obtieneReceptor(body.numero_documento, body.tipo_documento, body.razon_social, body.direccion, body.correo);
        const comprobante = await nuevoComprobante(body.id, body.tipo, receptor, correlativo, body.placa, body.usuario);
        const factura = await createOrderApiMiFact(comprobante, receptor, body.tipo, correlativo);
        if(!factura.response.errors){
            actualizar = await actualizaAbastecimiento(body.id);
        }
        //const actualizar = await actualizaAbastecimiento(body.id);
        res.json({
            correlativo,
            receptor,
            comprobante,
            factura,
            actualizar
        });          
    } catch (error) {
        res.json({
            error
        });          
    }

    

    //Creación del XML
    //const facturaXML = makeXMLFactura(comprobante, receptor);
    //Firmar digitalmente
    //const facturaXMLSign = signXml(facturaXML);
    //Guardar el documento
    //const file = [process.env.EMISOR_RUC , body.tipo, correlativo].join('-')
    //asyncWriteFile(file + '.xml', facturaXML);

}