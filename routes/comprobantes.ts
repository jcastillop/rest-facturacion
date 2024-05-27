import { Router } from 'express';
import { cierreTurno, createCierreDia, listaTurnosPorCerrar, historicoComprobantes, modificaComprobante, historicoCierres, cierreTurnoGalonaje, cierreTurnoTotalProducto, cierreTurnoTotalSoles, generaComprobanteV2, getComprobante, getNotasDespacho, comprobanteNuevo, obtieneDescuentos, getFechaUltimoComprobante } from '../controllers/comprobantes';
import { rptCierreTurnos, rptComprobantes, rptDeclaracionMensual, rptDiarioRangos, rptProductoTurno, rptProductoTurnoTotalizados } from '../controllers/reportes';

const router = Router();

router.post('/billing',    comprobanteNuevo);

router.post('/comprobanteadmin',            generaComprobanteV2);

router.post('/modifica',    modificaComprobante);

router.get('/historico',   historicoComprobantes);

router.post('/cerrarturno', cierreTurno);

router.post('/cerrardia',   createCierreDia);

router.post('/listarturnos',listaTurnosPorCerrar);

router.post('/reportediario',rptDiarioRangos);

router.get('/reporteproductoturnos', rptProductoTurno);

router.post('/reporteproductoturnostotalizados', rptProductoTurnoTotalizados);

router.post('/reportedeclaracionmensual', rptDeclaracionMensual);

router.post('/reportecomprobantes', rptComprobantes);

router.get('/reportecierres', rptCierreTurnos);

router.get('/cierreturnohistorico',   historicoCierres);

router.get('/cierreturnogalonaje',   cierreTurnoGalonaje);

router.get('/cierreturnototalproducto',   cierreTurnoTotalProducto);

router.get('/cierreturnototalsoles',   cierreTurnoTotalSoles);

router.get('/comprobante',            getComprobante);

router.get('/notas',            getNotasDespacho);

router.post('/descuentos',        obtieneDescuentos);

router.get('/fecha_ultimo',            getFechaUltimoComprobante);


export default router;