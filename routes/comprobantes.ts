import { Router } from 'express';
import { cierreTurno, createCierreDia, generaComprobante, listaTurnosPorCerrar, historicoComprobantes } from '../controllers/comprobantes';
import { rptProducto, rptProductoTurno } from '../controllers/reportes';

const router = Router();

router.post('/',            generaComprobante);

router.get('/historico',   historicoComprobantes);

router.post('/cerrarturno', cierreTurno);

router.post('/cerrardia',   createCierreDia);

router.post('/listarturnos',listaTurnosPorCerrar);

router.post('/reporteproducto',rptProducto);

router.post('/reporteproductoturnos', rptProductoTurno);


export default router;