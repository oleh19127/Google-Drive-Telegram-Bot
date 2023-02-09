import { readdir } from "node:fs/promises";

export const getFileNamesFromFolder = async (tmpFolder) => {
  const filesInFolder = await readdir(tmpFolder);
  return filesInFolder;
};
