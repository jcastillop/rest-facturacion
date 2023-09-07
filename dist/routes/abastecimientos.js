"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const abastecimientos_1 = require("../controllers/abastecimientos");
const router = (0, express_1.Router)();
router.get('/', abastecimientos_1.getAbastecimientos);
router.get('/:id', abastecimientos_1.getAbastecimiento);
router.get('/count/total', abastecimientos_1.getCountAbastecimientos);
exports.default = router;
//# sourceMappingURL=abastecimientos.js.map