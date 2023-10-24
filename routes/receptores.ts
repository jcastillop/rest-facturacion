import { Router } from 'express';
import { autocompletarRuc, geReceptores, putReceptor, updateReceptor } from '../controllers/receptores';

const router = Router();

router.post('/',      autocompletarRuc);
router.get('/',             geReceptores);
router.put('/',             putReceptor);
router.post('/update',            updateReceptor);

export default router;