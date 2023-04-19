import { readdir } from "node:fs/promises";

export const getFileNamesFromFolder = async (tmpFolder) => {
  return await readdir(tmpFolder);
};
