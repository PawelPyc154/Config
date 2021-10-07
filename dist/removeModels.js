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
exports.removeModels = void 0;
require("colors");
const fs_1 = require("fs");
const path_1 = require("path");
const fsPromises = fs_1.promises;
const dirPath = (0, path_1.join)(process.cwd(), "../swaggerModels/model/");
const removeModels = (patterns) => __awaiter(void 0, void 0, void 0, function* () {
    yield fsPromises.unlink((0, path_1.resolve)(`${dirPath}models.ts`));
    console.log(patterns);
    const fileNames = yield fsPromises.readdir((0, path_1.resolve)(dirPath));
    for (const fileName of fileNames) {
        console.log(yield fsPromises.readFile(dirPath + fileName, "utf8"));
    }
});
exports.removeModels = removeModels;
//# sourceMappingURL=removeModels.js.map