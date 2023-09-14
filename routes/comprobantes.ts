import { Router } from 'express';
import { cierreTurno, createCierreDia, generaComprobante, listaTurnosPorCerrar, historicoComprobantes, modificaComprobante } from '../controllers/comprobantes';
import { rptProducto, rptProductoTurno } from '../controllers/reportes';

const router = Router();

router.post('/',            generaComprobante);

router.post('/modifica',    modificaComprobante);

router.get('/historico',   historicoComprobantes);

router.post('/cerrarturno', cierreTurno);

router.post('/cerrardia',   createCierreDia);

router.post('/listarturnos',listaTurnosPorCerrar);

router.post('/reporteproducto',rptProducto);

router.post('/reporteproductoturnos', rptProductoTurno);


export default router;