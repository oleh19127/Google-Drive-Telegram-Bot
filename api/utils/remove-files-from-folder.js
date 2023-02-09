import { deleteAsync } from "del";
import { readdir } from "node:fs/promises";

export const removeFilesFromFolder = async (folder) => {
  const filesInFolder = await readdir(folder);
  if (filesInFolder.length > 0) {
    const deletedFilePaths = await deleteAsync([`${folder}/**`]);
    // console.log("Deleted files:\n", deletedFilePaths.join("\n"));
    console.log(`Delete ${deletedFilePaths.length} files from tmp folder`);
  }
};
