"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const receptores_1 = require("../controllers/receptores");
const router = (0, express_1.Router)();
router.post('/', receptores_1.autocompletarRuc);
exports.default = router;
//# sourceMappingURL=receptores.js.map