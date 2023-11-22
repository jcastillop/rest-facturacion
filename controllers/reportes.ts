import { Request, Response } from "express";

import { generaReporteProductoCombustible, generaReporteProductoCombustibleTurno, generaReporteDeclaracionMensual, generaReporteCierreTurno } from "../models/comprobante";

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

export const rptDeclaracionMensual = async (req: Request, res: Response) => {

    const { month, year } = req.body;

    const { hasError, message, data } = await generaReporteDeclaracionMensual(month, year);

    res.json({
        hasError: hasError,
        message: message,
        data: data
    });     

}

export const rptCierreTurnos = async (req: Request, res: Response) => {

    const { fecha } = req.body;

    const { hasError, message, data } = await generaReporteCierreTurno(fecha);

    res.json({
        hasError: hasError,
        message: message,
        data: data
    });     

}