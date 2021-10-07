/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import "colors";
import { promises } from "fs";
import { join, resolve } from "path";
const fsPromises = promises;
// function uniqByKeepFirst(a: any, key: any) {
//   const seen = new Set()
//   return a.filter((item: any) => {
//     const k = key(item)
//     return seen.has(k) ? false : seen.add(k)
//   })
// }

const dirPath = join(process.cwd(), "../swaggerModels/model/");
export const removeModels = async (patterns: RegExp[]) => {
  console.log("test".blue);
  await fsPromises.unlink(resolve(`${dirPath}models.ts`));
  // get all file names in directory
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
