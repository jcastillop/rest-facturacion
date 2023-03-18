"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const abastecimientos_1 = require("../controllers/abastecimientos");
const router = (0, express_1.Router)();
router.get('/', abastecimientos_1.getAbastecimientos);
router.get('/:id', abastecimientos_1.getAbastecimiento);
exports.default = router;
//# sourceMappingURL=abastecimientos.js.map