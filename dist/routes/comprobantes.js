"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comprobantes_1 = require("../controllers/comprobantes");
const reportes_1 = require("../controllers/reportes");
const router = (0, express_1.Router)();
router.post('/', comprobantes_1.generaComprobante);
router.post('/modifica', comprobantes_1.modificaComprobante);
router.get('/historico', comprobantes_1.historicoComprobantes);
router.post('/cerrarturno', comprobantes_1.cierreTurno);
router.post('/cerrardia', comprobantes_1.createCierreDia);
router.post('/listarturnos', comprobantes_1.listaTurnosPorCerrar);
router.post('/reporteproducto', reportes_1.rptProducto);
router.post('/reporteproductoturnos', reportes_1.rptProductoTurno);
exports.default = router;
//# sourceMappingURL=comprobantes.js.map