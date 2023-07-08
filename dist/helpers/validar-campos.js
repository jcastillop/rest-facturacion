"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyNumbers = exports.validarCampos = void 0;
const express_validator_1 = require("express-validator");
const validarCampos = (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
};
exports.validarCampos = validarCampos;
const onlyNumbers = (array) => {
    return array.every(element => {
        console.log(parseInt(element));
        if (Number.isNaN(parseInt(element))) {
            return false;
        }
        return typeof parseInt(element) === 'number';
    });
};
exports.onlyNumbers = onlyNumbers;
//# sourceMappingURL=validar-campos.js.map