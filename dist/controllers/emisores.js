"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmisor = void 0;
const receptor_1 = __importDefault(require("../models/receptor"));
const getEmisor = (req, res) => {
    const { numero_documento } = req.params;
    try {
        const receptor = receptor_1.default.findAll({ where: { authorId: numero_documento } });
        if (receptor) {
            res.json(receptor);
        }
        else {
            res.status(404).json({
                msg: `No existe usuarioZZZZ con el documento ${numero_documento}`
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
    res.json("");
};
exports.getEmisor = getEmisor;
//# sourceMappingURL=emisores.js.map