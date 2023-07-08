import { Request, Response } from "express";
import Receptor from '../models/receptor';

interface ServiceParams {
    pistola?: number;
    desde?:Date;
    hasta?:Date;
    limit?: number;
    offset?: number;
}

export const getEmisor = (req: Request, res: Response) => {
    const { numero_documento } = req.params;

    try {
        const receptor = Receptor.findAll({ where: { authorId: numero_documento } });
        if(receptor){
            res.json(receptor);
        }else{
            res.status(404).json({
                msg: `No existe usuarioZZZZ con el documento ${ numero_documento }`
            });
        }         
    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
    res.json("");
}