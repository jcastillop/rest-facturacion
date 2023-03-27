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
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncWriteFile = exports.asyncWriteFile = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const asyncWriteFile = (filename, data) => __awaiter(void 0, void 0, void 0, function* () {
    //extensionesValidas = ['txt','xml'], carpeta:string = '',
    try {
        // await fsPromises.writeFile(join( __dirname, filename), data, {
        yield fs_1.promises.writeFile((0, path_1.join)('D:\\Fuentes\\Facturacion\\rest-facturacion\\xml\\', filename), data, {
            flag: 'w',
        });
        /*
        const contents = await fsPromises.readFile(
          join(__dirname, filename),
          'utf-8',
        );
        */
        //console.log(contents);
        //return contents;
    }
    catch (err) {
        //console.log(err);
        return 'Something went wrong';
    }
});
exports.asyncWriteFile = asyncWriteFile;
const syncWriteFile = (filename, data) => {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    console.log(__dirname);
    console.log(filename);
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, filename), data, {
        flag: 'w',
    });
    const contents = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, filename), 'utf-8');
    //console.log(contents); // 👉️ "One Two Three Four"
    return contents;
};
exports.syncWriteFile = syncWriteFile;
//# sourceMappingURL=manage-file.js.map