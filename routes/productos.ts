import { Router } from 'express';
import { getProductos, getProducto, putProducto, updateProducto, deleteProducto } from '../controllers/productos';


const router = Router();

router.get('/',             getProductos);
router.get('/:id',          getProducto);
router.put('/',             putProducto);
router.post('/',            updateProducto);
router.delete('/',          deleteProducto);

export default router;