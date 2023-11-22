"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comprobantes_1 = require("../controllers/comprobantes");
const reportes_1 = require("../controllers/reportes");
const router = (0, express_1.Router)();
router.post('/', comprobantes_1.generaComprobante);
router.post('/comprobanteadmin', comprobantes_1.generaComprobanteV2);
router.post('/modifica', comprobantes_1.modificaComprobante);
router.get('/historico', comprobantes_1.historicoComprobantes);
router.post('/cerrarturno', comprobantes_1.cierreTurno);
router.post('/cerrardia', comprobantes_1.createCierreDia);
router.post('/listarturnos', comprobantes_1.listaTurnosPorCerrar);
router.post('/reporteproducto', reportes_1.rptProducto);
router.post('/reporteproductoturnos', reportes_1.rptProductoTurno);
router.post('/reportedeclaracionmensual', reportes_1.rptDeclaracionMensual);
router.post('/reportecierres', reportes_1.rptCierreTurnos);
router.get('/cierreturnohistorico', comprobantes_1.historicoCierres);
router.get('/cierreturnogalonaje', comprobantes_1.cierreTurnoGalonaje);
router.get('/cierreturnototalproducto', comprobantes_1.cierreTurnoTotalProducto);
router.get('/cierreturnototalsoles', comprobantes_1.cierreTurnoTotalSoles);
router.get('/comprobante', comprobantes_1.getComprobante);
exports.default = router;
//# sourceMappingURL=comprobantes.js.map