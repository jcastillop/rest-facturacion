import { Router } from 'express';
import { getUsuarios, getUsuario, postUsuario, postUsuarioLogin, putUsuario, deleteUsuario, changePassword, resetPassword, adminAuthorize, getValidaIp } from '../controllers/usuarios';

const router = Router();

router.get('/',             getUsuarios);
//router.get('/:id',          getUsuario);
router.post('/',            postUsuario);
router.post('/passchange',  changePassword);
router.post('/passreset',   resetPassword);
router.post('/authorize',   adminAuthorize);
router.post('/login',       postUsuarioLogin);
router.put('/:id',          putUsuario);
router.delete('/:id',       deleteUsuario);
router.get('/validaip',     getValidaIp);

export default router;