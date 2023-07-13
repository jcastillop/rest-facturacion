import { Request, Response } from "express";
import Usuario from "../models/usuario";
import { Op } from "sequelize";
import { log4js } from "../helpers";

export const getUsuarios = (req: Request, res: Response) => {
    res.json({
        msg: 'getUsuarios'
    })
}

export const getUsuario = (req: Request, res: Response) => {

    const { user, password } = req.params;

    try {
        const usuario = Usuario.findAll({ where: {[Op.and]: [{ usuario: user },{ password: password }]}});

        if(usuario){            
            res.json(usuario);
        }else{
            res.status(404).json({
                msg: `Usuario y/o password incorrecto: ${ user }`
            });
        }         

    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
    res.json("");
}

export const postUsuario = async (req: Request, res: Response) => {

    const { body } = req;
    

    try {
        const usuario = await Usuario.findOne({ attributes: ['id', 'nombre', 'usuario', 'correo', 'rol', 'grifo', 'isla', 'jornada'], where: {[Op.and]: [{ usuario: body.user },{ password: body.password }]}});
        
        log4js( usuario, 'debug');
        if(usuario){
            res.json({usuario});            
        }else{
            res.status(404).json({
                msg: `Usuario y/o password incorrecto`
            });
        }         
    } catch (error) {
        console.log(error);
        log4js( error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
}

export const putUsuario = (req: Request, res: Response) => {

    const { id } = req.params;
    const { body } = req;

    res.json({
        msg: 'putUsuario',
        body
    })
}

export const deleteUsuario = (req: Request, res: Response) => {

    const { id } = req.params;

    res.json({
        msg: 'deleteUsuario',
        id    
    })
}