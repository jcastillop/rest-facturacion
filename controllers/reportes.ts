import { Request, Response } from "express";

import { generaReporteDiarioRangos, generaReporteProductoCombustibleTurno, generaReporteDeclaracionMensual, generaReporteCierreTurno, generaReporteProductoCombustibleTurnoExcel, generaReporteProductoCombustibleTurnoTotalizadoExcel, generaReporteComprobantes } from "../models/comprobante";

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

    const [ combustible_turno, combustible_turno_totalizado ] = await Promise.all([
        generaReporteProductoCombustibleTurnoExcel(fecha, turnos, usuarios),
        generaReporteProductoCombustibleTurnoTotalizadoExcel(fecha, turnos, usuarios)
    ])

    //const { hasError, message, data } = await generaReporteProductoCombustibleTurnoExcel(fecha, turnos, usuarios);

    res.json({
        hasError: combustible_turno.hasError && combustible_turno_totalizado.hasError,
        message: combustible_turno.message,
        data: {
            turnos: combustible_turno.data,
            totales: combustible_turno_totalizado.data
        }
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

export const rptComprobantes = async (req: Request, res: Response) => {

    const { fecha, fecha_fin, usuario, ruc, tipo_comprobante } = req.body;

    const { hasError, message, data } = await generaReporteComprobantes( fecha, fecha_fin, usuario, ruc, tipo_comprobante );

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