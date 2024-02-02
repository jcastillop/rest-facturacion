import { Sqlcn } from '../database/config';
import { QueryTypes } from "sequelize";
import { log4js } from '../helpers';


export const generaCorrelativo = async (tipo: string, serie: string, prefijo: string = ""): Promise<{ hasErrorCorrelativo: boolean; messageCorrelativo: string; correlativo: string; }> => {

    var correlativo= '';
    const ruc = process.env.EMISOR_RUC
    try {
        await Sqlcn.query(
            'DECLARE @correlativo NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spCorrelativoObtener :tipo, :serie, :prefijo, :ruc, @correlativo output, @resultado output;SELECT @correlativo as correlativo,@resultado as resultado;', 
            {
                replacements: { tipo, serie, prefijo, ruc },
                type: QueryTypes.SELECT,
                plain: true
            }).then((results: any)=>{
                correlativo= results.correlativo
            });
            return {
                hasErrorCorrelativo: false,
                messageCorrelativo: "Correlativo generado satisfactoriamente",
                correlativo: correlativo
            };
    } catch (error: any) {
        log4js( "generaCorrelativo: " + error.toString(), 'error');
        return {
            hasErrorCorrelativo: true,
            messageCorrelativo: "generaCorrelativo: " + error.toString(),
            correlativo: correlativo
        };
    }


        
}

export const generaComprobanteFirstStep = async (idAbastecimiento: number, idTipoDocumento: string, idSerie: string, prefijo: string, receptorTipoDocumento: number, receptorNumeroDocumento: string ): Promise<{ hasErrorCorrelativo: boolean; messageCorrelativo: string; correlativo: string; correlativo_resultado: string; receptor_id: string; resultado: string; }> => {
    log4js( "Inicio generaComprobanteFirstStep: abastecimiento " + idAbastecimiento);
    var correlativo= '';
    var correlativo_resultado= '';
    var receptor_id= '';
    var resultado= '';
    const ruc = process.env.EMISOR_RUC
    try {
        await Sqlcn.query(
            'DECLARE @correlativo NVARCHAR(11);DECLARE @correlativo_resultado NVARCHAR(11);DECLARE @receptor_id NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spComprobanteFirstStep :idAbastecimiento, :idTipoDocumento, :idSerie, :prefijo, :ruc, :receptorTipoDocumento, :receptorNumeroDocumento, @correlativo output, @correlativo_resultado output, @receptor_id output, @resultado output;SELECT @correlativo as correlativo,@correlativo_resultado as correlativo_resultado,@receptor_id as receptor_id,@resultado as resultado;', 
            {
                replacements: { idAbastecimiento, idTipoDocumento, idSerie, prefijo, ruc, receptorTipoDocumento, receptorNumeroDocumento },
                type: QueryTypes.SELECT,
                plain: true
            }).then((results: any)=>{
                correlativo= results.correlativo
                correlativo_resultado= results.correlativo_resultado
                receptor_id= results.receptor_id
                resultado= results.resultado
            });
            log4js( "Fin generaComprobanteFirstStep: "+ correlativo);
            return {
                hasErrorCorrelativo: false,
                messageCorrelativo: "Correlativo generado satisfactoriamente",
                correlativo: correlativo,
                correlativo_resultado: correlativo_resultado,
                receptor_id: receptor_id,
                resultado: resultado
            };
            
    } catch (error: any) {
        log4js( "generaCorrelativo: " + error.toString(), 'error');
        return {
            hasErrorCorrelativo: true,
            messageCorrelativo: "generaCorrelativo: " + error.toString(),
            correlativo: correlativo,
            correlativo_resultado: correlativo_resultado,
            receptor_id: receptor_id,
            resultado: resultado
        };
    }
    

        
}
