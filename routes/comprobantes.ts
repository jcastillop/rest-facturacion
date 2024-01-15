import { Router } from 'express';
import { cierreTurno, createCierreDia, generaComprobante, listaTurnosPorCerrar, historicoComprobantes, modificaComprobante, historicoCierres, cierreTurnoGalonaje, cierreTurnoTotalProducto, cierreTurnoTotalSoles, generaComprobanteV2, getComprobante, getNotasDespacho } from '../controllers/comprobantes';
import { rptCierreTurnos, rptDeclaracionMensual, rptProducto, rptProductoTurno } from '../controllers/reportes';

const router = Router();

router.post('/',            generaComprobante);

router.post('/comprobanteadmin',            generaComprobanteV2);

router.post('/modifica',    modificaComprobante);

router.get('/historico',   historicoComprobantes);

router.post('/cerrarturno', cierreTurno);

router.post('/cerrardia',   createCierreDia);

router.post('/listarturnos',listaTurnosPorCerrar);

router.post('/reporteproducto',rptProducto);

router.post('/reporteproductoturnos', rptProductoTurno);

router.post('/reportedeclaracionmensual', rptDeclaracionMensual);

router.post('/reportecierres', rptCierreTurnos);

router.get('/cierreturnohistorico',   historicoCierres);

router.get('/cierreturnogalonaje',   cierreTurnoGalonaje);

router.get('/cierreturnototalproducto',   cierreTurnoTotalProducto);

router.get('/cierreturnototalsoles',   cierreTurnoTotalSoles);

router.get('/comprobante',            getComprobante);

router.get('/notas/:id',            getNotasDespacho);


export default router;