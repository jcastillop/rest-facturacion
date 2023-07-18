"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comprobantes_1 = require("../controllers/comprobantes");
const router = (0, express_1.Router)();
router.post('/', comprobantes_1.generaComprobante);
router.get('/', comprobantes_1.obtieneComprobante);
exports.default = router;
//# sourceMappingURL=comprobantes.js.map