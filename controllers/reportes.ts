import { Request, Response } from "express";

import { generaReporteDiarioRangos, generaReporteProductoCombustibleTurno, generaReporteDeclaracionMensual, generaReporteCierreTurno, generaReporteProductoCombustibleTurnoExcel } from "../models/comprobante";

export const rptDiarioRangos = async (req: Request, res: Response) => {

    const { fecha_inicio, fecha_fin } = req.body;

    const { hasError, message, data } = await generaReporteDiarioRangos( fecha_inicio, fecha_fin );

    res.json({
        hasError: hasError,
        message: message,
        data: data
    });     

}

export const rptProductoTurno = async (req: Request, res: Response) => {

    const { fecha } = req.query;

    const { hasError, message, data } = await generaReporteProductoCombustibleTurno(fecha?.toString()||"");

    res.json({
        hasError: hasError,
        message: message,
        data: data
    });       

}
export const rptProductoTurnoTotalizados = async (req: Request, res: Response) => {

    const { fecha, turnos, usuarios } = req.body;

    const { hasError, message, data } = await generaReporteProductoCombustibleTurnoExcel(fecha, turnos, usuarios);

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

    const { fecha } = req.query;

    const { hasError, message, data } = await generaReporteCierreTurno(fecha?.toString()||"");

    res.json({
        hasError: hasError,
        message: message,
        data: data
    });     

}