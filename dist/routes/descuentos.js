"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const descuentos_1 = require("../controllers/descuentos");
const router = (0, express_1.Router)();
router.get('/:id', descuentos_1.getDescuentos);
router.post('/obtener', descuentos_1.postDescuento);
router.put('/', descuentos_1.putDescuento);
router.post('/', descuentos_1.updateDescuento);
router.delete('/', descuentos_1.deleteDescuento);
exports.default = router;
//# sourceMappingURL=descuentos.js.map