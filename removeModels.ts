import "colors";
import { promises } from "fs";
import { join, resolve } from "path";
const fsPromises = promises;

const dirPath = join(process.cwd(), "../swaggerModels/model/");
export const removeModels = async (patterns: RegExp[]) => {
  await fsPromises.unlink(resolve(`${dirPath}models.ts`));
  const fileNames = await fsPromises.readdir(resolve(dirPath));
  for (const fileName of fileNames) {
    const fileContent = await fsPromises.readFile(dirPath + fileName, "utf8");
    for (const pattern of patterns) {
      if (pattern.test(fileContent)) {
        console.log(`Deleted ${fileName}`.red);
        await fsPromises.unlink(resolve(dirPath + fileName));
        break;
      }
    }
  }
};
