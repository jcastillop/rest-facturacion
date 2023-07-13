import { Router } from 'express';
import { autocompletarRuc } from '../controllers/receptores';

const router = Router();

router.post('/',      autocompletarRuc);

export default router;