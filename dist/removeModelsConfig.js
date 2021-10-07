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
const child_process_1 = require("child_process");
const test3 = 0;
const test2 = test3;
console.log(test2);
require("colors");
const removeModels_1 = require("./removeModels");
const modelsPath = "models";
(0, child_process_1.execSync)(`rm -rf ${modelsPath}/*`);
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, child_process_1.execSync)("sc generate -i https://api.income.training/swagger/v1/swagger.json -l typescript-angular -o ../swaggerModels");
    yield (0, removeModels_1.removeModels)([
        /Response\s*\{(\s*)\}/,
        /export (interface|const) Body+/,
        /export (interface|const) Management+/,
        /export (interface|const) Landing+/,
        /export (interface|const) Panal+/,
        /export (interface|const) Widget+/,
        /export (interface|const) Models+/,
    ]).then(() => {
    });
});
test();
//# sourceMappingURL=removeModelsConfig.js.map