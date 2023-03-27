import { Sqlcn } from '../database/config';
import { QueryTypes } from "sequelize";


export const generaCorrelativo = async (tipo: string, serie: string): Promise<string> => {

    var correlativo= '';
    await Sqlcn.query(
        'DECLARE @correlativo NVARCHAR(11);DECLARE @resultado CHAR(3);EXEC spCorrelativoObtener :tipo, :serie, @correlativo output, @resultado output;SELECT @correlativo as correlativo,@resultado as resultado;', 
        {
            replacements: { tipo, serie },
            type: QueryTypes.SELECT,
            plain: true
        }).then((results: any)=>{
            correlativo= results.correlativo
        });

        return correlativo;
}
