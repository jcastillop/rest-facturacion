import { Router } from 'express';
import { cierreTurno, createCierreDia, generaComprobante, listaTurnosPorCerrar, historicoComprobantes } from '../controllers/comprobantes';

const router = Router();

router.post('/',            generaComprobante);

router.post('/historico',   historicoComprobantes);

router.post('/cerrarturno', cierreTurno);

router.post('/cerrardia',   createCierreDia);

router.post('/listarturnos',listaTurnosPorCerrar);


export default router;