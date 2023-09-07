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
