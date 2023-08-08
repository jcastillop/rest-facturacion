"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_1 = require("../controllers/usuarios");
const router = (0, express_1.Router)();
router.get('/', usuarios_1.getUsuarios);
router.get('/:id', usuarios_1.getUsuario);
router.post('/', usuarios_1.postUsuario);
router.post('/passchange', usuarios_1.changePassword);
router.post('/passreset', usuarios_1.resetPassword);
router.post('/authorize', usuarios_1.adminAuthorize);
router.post('/login', usuarios_1.postUsuarioLogin);
router.put('/:id', usuarios_1.putUsuario);
router.delete('/:id', usuarios_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=usuarios.js.map