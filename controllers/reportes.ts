import { Request, Response } from "express";

import { generaReporteProductoCombustible, generaReporteProductoCombustibleTurno } from "../models/comprobante";

export const rptProducto = async (req: Request, res: Response) => {

    const { fecha } = req.body;

    const { hasError, message, data } = await generaReporteProductoCombustible(fecha);

    res.json({
        hasError: hasError,
        message: message,
        data: data
    });     

}

export const rptProductoTurno = async (req: Request, res: Response) => {

    const { fecha, turnos, usuarios } = req.body;

    const { hasError, message, data } = await generaReporteProductoCombustibleTurno(fecha, turnos, usuarios);

    res.json({
        hasError: hasError,
        message: message,
        data: data
    });     

}