import { Router } from 'express';
import { generaComprobante } from '../controllers/comprobantes';

const router = Router();

router.post('/',      generaComprobante);

export default router;