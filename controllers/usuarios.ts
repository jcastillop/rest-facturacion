import { Request, Response } from "express";
import Usuario, { validaUsuarios } from "../models/usuario";
import { Op } from "sequelize";
import { log4js } from "../helpers";
import Isla from "../models/isla";
import ipaddr from "ipaddr.js";
import { nuevoLogin } from "../models/login";
import Terminal from "../models/terminal";


export const getUsuarios = async (req: Request, res: Response) => {

    try {
        const { count, rows } = await Usuario.findAndCountAll();

        if(rows){            
            res.json({usuarios: rows});
        }else{
            res.status(404).json({
                msg: `No existen usuarios`
            });
        }         

    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
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

export const getValidaIp = async (req: Request, res: Response) => {
    
    let remoteAddress = req.ip;

    if (ipaddr.isValid(req.ip)) {
      remoteAddress = ipaddr.process(req.ip).toString();
    }else{
        remoteAddress = ""
    }

    try {

        const isla: any = await Isla.findOne({ where: { ip: remoteAddress }, include: [ { model: Terminal } ]});

        if(isla && isla.Terminale){

            res.json({
                message: `Isla existe`,
                hasError: false,
                terminal: isla.Terminale.nombre,
                isla: isla.nombre
            })                    
        }else{
            res.json({
                message: `Isla o terminal no registrada`,
                hasError:true,
                terminal: "",
                isla: ""
            })  
        }

    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });                 
    }


}

export const postUsuarioLogin = async (req: Request, res: Response) => {

    const { user, password, turno, isla, terminal } = req.body;
    
    let remoteAddress = req.ip;

    if (ipaddr.isValid(req.ip)) {
      remoteAddress = ipaddr.process(req.ip).toString();
    }

    var today = new Date()
    today.setHours(today.getHours() - 5);    

    try {
        const usuario = await nuevoLogin(user, password, terminal, isla, turno, remoteAddress, today)
       
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

export const postUsuario = async (req: Request, res: Response) => {

    const { body } = req;

    try {
        if(await validaUsuarios(body.usuario)){
            const usuario = await Usuario.create({
                nombre: body.nombre,
                usuario: body.usuario,
                correo: body.correo,
                password: 'MTIzNA==',
                rol: body.rol,
                EmisorId: body.EmisorId
            })
    
            res.json({
                message: `Usuario creado correctamente`,
                usuario: usuario,
                hasError:false
            })
        }else{
            res.json({
                message: `Usuario ya existe`,
                hasError:true
            })            
        }


    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            hasError:true,
            message: `Error no identificado ${ error }`
        });      
    }
}

export const putUsuario = (req: Request, res: Response) => {

    const { id } = req.params;
    const { body } = req;

   
}

export const resetPassword = async (req: Request, res: Response) => {

    const { body } = req;

    try {
        const data = await Usuario.update(
            {
                password: 'MTIzNA=='
            },
            {
                where: { id: body.id },
                returning: true      
            }
        );
        res.json({
            message: `Password reiniciado correctamente`,
            hasError: false
        })
    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            message: `Error no identificado ${ error }`,
            hasError: true
        });      
    }
}

export const changePassword = async (req: Request, res: Response) => {

    const { body } = req;

    const encoded = Buffer.from(body.password, 'utf8').toString('base64')  

    try {
        const data = await Usuario.update(
            {
                password: encoded
            },
            {
                where: { id: body.id },
                returning: true      
            }
        );
        res.json({
            message: `Password cambiado correctamente`,
            hasError: false
        })
    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            msg: `Error no identificado ${ error }`,
            hasError: true
        });      
    }
}

export const deleteUsuario = (req: Request, res: Response) => {

    const { id } = req.params;

    res.json({
        msg: 'deleteUsuario',
        id    
    })
}

export const adminAuthorize = async (req: Request, res: Response) => {

    const { body } = req;

    try {


        const encoded = Buffer.from(body.password, 'utf8').toString('base64')  
        const data = await Usuario.findOne({ where: { password: encoded, rol: 'ADMIN_ROLE' }});

        if(data){
            res.json({
                message: `Contaseña correcta`,
                hasSuccess: true
            })
        }else{
            res.json({
                message: `La contraseña proporcionada no coincide`,
                hasSuccess: false
            })
        }

    } catch (error) {
        log4js( error, 'error');
        res.status(404).json({
            message: `Error no identificado ${ error }`,
            hasSuccess: false
        });      
    }
}