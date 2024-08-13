import { Router } from 'express';
import { deleteDescuento, getDescuentos, postDescuento, putDescuento, updateDescuento } from '../controllers/descuentos';

const router = Router();

router.get('/:id',          getDescuentos);
router.post('/obtener',     postDescuento);
router.put('/',             putDescuento);
router.post('/',            updateDescuento);
router.delete('/',          deleteDescuento);

export default router;