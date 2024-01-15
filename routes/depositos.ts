import { Router } from 'express';
import { getDepositos, postDeposito, putDeposito, updateDeposito, deleteDeposito } from '../controllers/depositos';


const router = Router();


router.get('/:id',          getDepositos);
router.post('/obtener',     postDeposito);
router.put('/',             putDeposito);
router.post('/',            updateDeposito);
router.delete('/',          deleteDeposito);

export default router;