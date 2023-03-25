import { Request, Response } from "express";
import Abastecimiento from "../models/abastecimiento";
import { Sqlcn } from '../database/config';
import { QueryTypes } from "sequelize";
import Comprobante from "../models/comprobante";
import Item from "../models/item";
import { crearFactura } from "../helpers/xml-builder";
import { asyncWriteFile, syncWriteFile } from "../helpers/manage-file";

interface ResponseParams {
    correlativo?: String;
    resultado?:String;
}

export const generaComprobante = async (req: Request, res: Response) => {

    const { body } = req;
    console.log(body);
    let correlativo = '', resultado = '000' 
 
    //Obtiene correlativo
    const result = await Sqlcn.query(
        'DECLARE @correlativo NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spCorrelativoObtener :tipo, :serie, @correlativo output, @resultado output;SELECT @correlativo as correlativo,@resultado as resultado;', 
        {
            replacements: { tipo: "01", serie: '001'},
            type: QueryTypes.SELECT,
            plain: true
        }).then((results : ResponseParams | any)=>{
            correlativo = results.correlativo;
            resultado = results.resultado;
        });
    //Completar la información requerida en un modelo 
    const abastecimiento: any = await Abastecimiento.findByPk(body.id);
    //Guardar en BD   
    console.log(abastecimiento);
    const comprobante = Comprobante.build({ 
        tipo_comprobante: '01',
        numeracion_documento_afectado: correlativo,
        total_gravadas:'',
        total_igv:'',
        total_venta:'',
        Items:[{
            cantidad: abastecimiento.volTotal,
            valor_unitario:(parseFloat(abastecimiento.precioUnitario)/1.18).toFixed(10),
            precio_unitario: abastecimiento.precioUnitario,
            igv:(parseFloat(abastecimiento.precioUnitario)*(18/118)).toFixed(2),
            descripcion:'GLP',
            codigo_producto:'07',
            placa:'4298-PA',
        }]
    }, {
        include: [{
            model: Item,
            as: 'Items'
        }]
      });

    await comprobante.save();
    //Crear el archivo XML    
    const factura = crearFactura(comprobante);
    //console.log(factura);
    syncWriteFile('./factura.xml', factura);
    /*
    res.json({
        abastecimiento
    });
    */     
    //TODO: Almacenar el archivo XML

    if(resultado = '000'){
        res.json({
            factura.
        });
    }else{
        res.status(404).json({
            msg: `Existen errores ${resultado}`, resultado
        });
    }

    
}