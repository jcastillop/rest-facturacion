import { Router } from 'express';
import { getGastos, postGasto, putGasto, updateGasto, deleteGasto } from '../controllers/gastos';


const router = Router();


router.get('/:id',           getGastos);
router.post('/obtener',             postGasto);
router.put('/',             putGasto);
router.post('/',            updateGasto);
router.delete('/',          deleteGasto);

export default router;