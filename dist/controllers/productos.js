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
exports.deleteProducto = exports.updateProducto = exports.putProducto = exports.getProducto = exports.getProductos = void 0;
const producto_1 = __importDefault(require("../models/producto"));
const helpers_1 = require("../helpers");
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estado = 1, limite = 15, desde = 0 } = req.query;
    try {
        const queryParams = {
            offset: Number(desde),
            limit: Number(limite),
            raw: true
        };
        const data = yield producto_1.default.findAndCountAll(queryParams);
        res.json({
            message: "Consulta realizada satisfactoriamente",
            total: data.count,
            productos: data.rows
        });
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.getProductos = getProductos;
const getProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio getProducto");
    const { id } = req.params;
    try {
        const producto = yield producto_1.default.findOne({ where: { id: id }, raw: true });
        res.json({
            producto
        });
        (0, helpers_1.log4js)("Fin getProducto");
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.getProducto = getProducto;
const putProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio putProducto");
    const { codigo, nombre, medida, descripcion, precio, valor, stock } = req.body;
    try {
        const producto = producto_1.default.build({
            nombre,
            medida,
            descripcion,
            codigo,
            precio,
            valor,
            stock
        });
        yield producto.save();
        (0, helpers_1.log4js)("Fin putProducto: " + JSON.stringify(producto));
        if (producto) {
            res.json({
                hasError: false,
                message: `Producto creado correctamente`,
                producto: producto
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al crear producto`,
                producto: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.putProducto = putProducto;
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio updateProducto");
    const { id, codigo, nombre, medida, descripcion, precio, valor, stock } = req.body;
    try {
        const producto = yield producto_1.default.update({
            codigo, nombre, medida, descripcion, precio, valor, stock
        }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin updateProducto: " + JSON.stringify(producto));
        if (producto) {
            res.json({
                hasError: false,
                message: `Producto actualizado correctamente`,
                producto: producto
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al actualizar producto`,
                producto: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.updateProducto = updateProducto;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helpers_1.log4js)("Inicio deleteProducto");
    const { id } = req.body;
    try {
        const data = yield producto_1.default.update({ estado: 0 }, {
            where: { id: id },
            returning: true
        });
        (0, helpers_1.log4js)("Fin deleteProducto: " + JSON.stringify(data));
        if (data) {
            res.json({
                hasError: false,
                message: `Producto eliminado`,
                producto: data
            });
        }
        else {
            res.json({
                hasError: true,
                message: `Error al eliminar producto/no encontrado`,
                producto: null
            });
        }
    }
    catch (error) {
        res.status(404).json({
            msg: `Error no identificado ${error}`
        });
    }
});
exports.deleteProducto = deleteProducto;
//# sourceMappingURL=productos.js.map