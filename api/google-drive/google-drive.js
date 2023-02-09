import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { UtilsGDrive } from "utils-google-drive";
import { mkdirWrapper } from "../file-system-wrapper/mkdir-wrapper.js";
import * as dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const utilsGDrive = new UtilsGDrive({
  pathCredentials: join(__dirname, process.env.GOOGLE_DRIVE_CREDENTIALS),
  pathToken: join(__dirname, process.env.GOOGLE_DRIVE_TOKEN),
});

class GoogleDrive {
  async getAllFiles() {
    const searchFolderId = process.env.GOOGLE_DRIVE_SEARCH_FOLDER;
    let nextPageToken = "";
    let allFiles = [];
    while (true) {
      const result = await utilsGDrive.listFiles({
        pageSize: 500,
        q: `"${searchFolderId}" in parents and trashed=false`,
        pageToken: nextPageToken || "",
        fields: "nextPageToken, files(id, name, modifiedTime)",
      });
      const files = result.files;
      if (files.length === 0) {
        console.log("No files found!!!");
        return;
      }
      for (const file of files) {
        allFiles.push({
          name: file.name,
          id: file.id,
          modTime: file.modifiedTime,
        });
      }
      nextPageToken = result.nextPageToken;
      if (nextPageToken === undefined) {
        break;
      }
    }
    return allFiles;
  }

  async getFileId(name, folderName = "Gallery") {
    await utilsGDrive.getFileId({
      fileName: name,
      parentName: folderName,
    });
  }

  async downloadFile(
    id,
    parentFolder = "Gallery",
    tmpFolder = join(__dirname, "temporary-images")
  ) {
    console.log("Start Download");
    await mkdirWrapper.init(tmpFolder);
    await utilsGDrive.download(
      {
        parentName: parentFolder,
        fileId: id,
      },
      tmpFolder
    );
    console.log("End Download");
  }

  async deleteFile(id, parentFolder) {
    await utilsGDrive.del({
      fileId: id,
      parentName: parentFolder,
    });
  }

  async getFileMimeType(id, folderName) {
    return await utilsGDrive.getMimeType({
      fileId: id,
      parentName: folderName,
    });
  }
}

export const googleDrive = new GoogleDrive();
