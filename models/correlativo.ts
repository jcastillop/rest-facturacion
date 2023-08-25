import { Sqlcn } from '../database/config';
import { QueryTypes } from "sequelize";
import { log4js } from '../helpers';


export const generaCorrelativo = async (tipo: string, serie: string): Promise<{ hasErrorCorrelativo: boolean; messageCorrelativo: string; correlativo: string; }> => {
    log4js( "Inicio generaCorrelativo");
    var correlativo= '';
    try {
        await Sqlcn.query(
            'DECLARE @correlativo NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spCorrelativoObtener :tipo, :serie, @correlativo output, @resultado output;SELECT @correlativo as correlativo,@resultado as resultado;', 
            {
                replacements: { tipo, serie },
                type: QueryTypes.SELECT,
                plain: true
            }).then((results: any)=>{
                correlativo= results.correlativo
            });
        log4js( "Fin generaCorrelativo " + correlativo);
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
