import { Router } from 'express';
import { getAbastecimientos, getAbastecimiento } from '../controllers/abastecimientos';

const router = Router();

router.get('/',         getAbastecimientos);
router.get('/:id',      getAbastecimiento);

export default router;