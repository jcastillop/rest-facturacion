"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comprobantes_1 = require("../controllers/comprobantes");
const router = (0, express_1.Router)();
router.post('/', comprobantes_1.generaComprobante);
router.post('/historico', comprobantes_1.historicoComprobantes);
router.post('/cerrarturno', comprobantes_1.cierreTurno);
router.post('/cerrardia', comprobantes_1.createCierreDia);
router.post('/listarturnos', comprobantes_1.listaTurnosPorCerrar);
exports.default = router;
//# sourceMappingURL=comprobantes.js.map