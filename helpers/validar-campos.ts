import  {validationResult} from 'express-validator'
import { Request, Response } from "express";

export const validarCampos = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
}

export const onlyNumbers = (array: string[]): boolean => {
    return array.every(element => {
        if(Number.isNaN(parseInt(element))) {return false}
        return typeof parseInt(element) === 'number';
    });
}