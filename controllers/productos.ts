import { Request, Response } from "express";
import Producto from '../models/producto';
import { log4js } from "../helpers";


export const getProductos = async (req: Request, res: Response) => {
    
    const { estado = 1, limite = 15, desde = 0 } = req.query;

    try {

        const queryParams = {
            offset: Number(desde),
            limit:  Number(limite),
            raw:    true
        }        

        const data: any = await Producto.findAndCountAll(
            queryParams
        );
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count, 
            productos: data.rows
        });

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });         
    }
}

export const getProducto = async (req: Request, res: Response) => {
    log4js( "Inicio getProducto");
    const { id } = req.params;
    
    try {

        const producto = await Producto.findOne({ where : { id: id}, raw: true});

        res.json({
            producto
        });  
        log4js( "Fin getProducto");
    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });          
    }
    
}

export const putProducto = async (req: Request, res: Response) => {
    log4js( "Inicio putProducto");
    const { codigo, nombre, medida, descripcion, precio,valor, stock } = req.body;
    try {
        const producto = Producto.build({ 
            nombre,
            medida,
            descripcion,
            codigo,
            precio,
            valor,
            stock
        })

        await producto.save();

    log4js( "Fin putProducto: " + JSON.stringify(producto));   

    if(producto){
        res.json({
            hasError: false,
            message: `Producto creado correctamente`,
            producto: producto
        })         
    }else{
        res.json({
            hasError: true,
            message: `Error al crear producto`,
            producto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const updateProducto = async (req: Request, res: Response) => {
    log4js( "Inicio updateProducto");
    const { id, codigo, nombre, medida, descripcion, precio, valor, stock } = req.body;
    try {

        const producto = await Producto.update({ 
            codigo, nombre, medida, descripcion, precio,valor, stock
        },{
            where: { id: id },
            returning: true      
        })
        

    log4js( "Fin updateProducto: " + JSON.stringify(producto));   

    if(producto){
        res.json({
            hasError: false,
            message: `Producto actualizado correctamente`,
            producto: producto
        })                      
    }else{
        res.json({
            hasError: true,
            message: `Error al actualizar producto`,
            producto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}

export const deleteProducto = async (req: Request, res: Response) => {
    log4js( "Inicio deleteProducto");
    const { id } = req.body;
    try {
        const data = await Producto.update({ estado: 0 },{
            where: { id: id },
            returning: true      
        })
    log4js( "Fin deleteProducto: " + JSON.stringify(data));   

    if(data){
        res.json({
            hasError: false,
            message: `Producto eliminado`,
            producto: data
        })        
    }else{
        res.json({
            hasError: true,
            message: `Error al eliminar producto/no encontrado`,
            producto: null
        })
    }          

    } catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${ error }`
        });             
    }
}