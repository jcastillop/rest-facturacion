import { Router } from 'express';
import { getProductos, getProductosTipo, getProducto, putProducto, updateProducto, deleteProducto } from '../controllers/productos';


const router = Router();

router.get('/',             getProductos);
router.get('/:id',          getProducto);
router.get('/tipo/:id',          getProductosTipo);
router.put('/',             putProducto);
router.post('/',            updateProducto);
router.delete('/',          deleteProducto);

export default router;