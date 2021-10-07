import { execSync } from "child_process";
import "colors";
import { removeModels } from "./removeModels";

const addModels = async (modelsPath: string) => {
  execSync(`rm -rf ${modelsPath}/*`);
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
  ]);
  execSync(`mv ../swaggerModels/model/* ${modelsPath}`);
  execSync("rm -r ../swaggerModels");
};

addModels("models");
