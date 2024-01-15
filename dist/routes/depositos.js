"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const depositos_1 = require("../controllers/depositos");
const router = (0, express_1.Router)();
router.get('/:id', depositos_1.getDepositos);
router.post('/obtener', depositos_1.postDeposito);
router.put('/', depositos_1.putDeposito);
router.post('/', depositos_1.updateDeposito);
router.delete('/', depositos_1.deleteDeposito);
exports.default = router;
//# sourceMappingURL=depositos.js.map