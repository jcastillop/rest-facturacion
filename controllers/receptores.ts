import { Request, Response } from "express";
import Receptor from "../models/receptor";
import { Op } from "sequelize";

export const autocompletarRuc = async (req: Request, res: Response) => {

    const { body } = req;

    const receptores = await Receptor.findAll({
        where: {
            numero_documento: {
            [Op.like]: `${body.valor}%`
            }
        }, 
        raw: true
      });
    res.json({
        receptores
    });  
}
