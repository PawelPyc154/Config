// import "colors";
// import { promises } from "fs";
// import { join, resolve } from "path";
// const fsPromises = promises;

// const dirPath = join(process.cwd(), "../swaggerModels/model/");
// export const removeModels = async (patterns: RegExp[]) => {
//   await fsPromises.unlink(resolve(`${dirPath}models.ts`));
//   const fileNames = await fsPromises.readdir(resolve(dirPath));
//   for (const fileName of fileNames) {
//     const fileContent = await fsPromises.readFile(dirPath + fileName, "utf8");
//     for (const pattern of patterns) {
//       if (pattern.test(fileContent)) {
//         console.log(`Deleted ${fileName}`.red);
//         fsPromises.unlink(resolve(dirPath + fileName));
//         break;
//       }
//     }
//   }
// };

/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import "colors";
import { promises } from "fs";
import { join, resolve } from "path";
const fsPromises = promises;

const dirPath = join(process.cwd(), "../swaggerModels/model/");
export const removeModels = async (patterns: RegExp[]) => {
  await fsPromises.unlink(resolve(`${dirPath}models.ts`));
  const fileNames = await fsPromises.readdir(resolve(dirPath));
  const array = await Promise.all(
    await fileNames.map(async (fileName) => {
      return {
        fileName: fileName,
        fileContent: await fsPromises.readFile(dirPath + fileName, "utf8"),
      };
    })
  );
  const filesToRemove = array.reduce((prev: string[], curr) => {
    for (const pattern of patterns) {
      if (pattern.test(curr.fileContent)) {
        return [...prev, curr.fileName];
      }
    }
    return [...prev];
  }, []);

  return await Promise.all(
    filesToRemove.map((fileName) =>
      fsPromises.unlink(resolve(dirPath + fileName))
    )
  );
};
