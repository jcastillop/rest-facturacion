import { Router } from 'express';
import { check } from 'express-validator';
import { getAbastecimientos, getAbastecimiento, getCountAbastecimientos } from '../controllers/abastecimientos';
import { validarCampos } from "../helpers/validar-campos";

const router = Router();

router.get('/', getAbastecimientos);
router.get('/:id', getAbastecimiento);
router.get('/count/total', getCountAbastecimientos);

export default router;