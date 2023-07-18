import { Router } from 'express';
import { generaComprobante, obtieneComprobante } from '../controllers/comprobantes';

const router = Router();

router.post('/',      generaComprobante);

router.get('/',      obtieneComprobante);

export default router;