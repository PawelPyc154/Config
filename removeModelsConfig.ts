import { execSync } from "child_process";
// import util from 'util'
// const execTest = util.promisify(exec)

console.log("test");
import "colors";
import { removeModels } from "./removeModels";

const modelsPath = "models";

execSync(`rm -rf ${modelsPath}/*`);
//
const test = async () => {
  execSync(
    "sc generate -i https://api.income.training/swagger/v1/swagger.json -l typescript-angular -o ../swaggerModels"
  );

  await removeModels([
    /Response\s*\{(\s*)\}/,
    /export (interface|const) Body+/,
    /export (interface|const) Management+/,
    /export (interface|const) Landing+/,
    /export (interface|const) Panal+/,
    /export (interface|const) Widget+/,
    /export (interface|const) Models+/,
  ]).then(() => {
    execSync(`mv ../swaggerModels/model/* ${modelsPath}`);
    execSync("rm -r ../swaggerModels");
  });
};

test();
