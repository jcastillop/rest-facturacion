"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocompletarRuc = void 0;
const receptor_1 = __importDefault(require("../models/receptor"));
const sequelize_1 = require("sequelize");
const autocompletarRuc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const receptores = yield receptor_1.default.findAll({
        where: {
            numero_documento: {
                [sequelize_1.Op.like]: `${body.valor}%`
            }
        },
        raw: true
    });
    console.log(receptores);
    res.json({
        receptores
    });
});
exports.autocompletarRuc = autocompletarRuc;
//# sourceMappingURL=receptores.js.map