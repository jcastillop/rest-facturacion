"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gastos_1 = require("../controllers/gastos");
const router = (0, express_1.Router)();
router.get('/:id', gastos_1.getGastos);
router.post('/obtener', gastos_1.postGasto);
router.put('/', gastos_1.putGasto);
router.post('/', gastos_1.updateGasto);
router.delete('/', gastos_1.deleteGasto);
exports.default = router;
//# sourceMappingURL=gastos.js.map