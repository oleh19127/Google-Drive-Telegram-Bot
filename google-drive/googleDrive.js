import 'dotenv/config';
import { UtilsGDrive } from 'utils-google-drive';

class GoogleDrive {
  utilsGDrive = new UtilsGDrive({
    pathCredentials: `${process.env.GOOGLE_DRIVE_CREDENTIALS}`,
    pathToken: `${process.env.GOOGLE_DRIVE_TOKEN}`,
  });

  async getAllFiles() {
    const searchFolderID = process.env.GOOGLE_DRIVE_SEARCH_FOLDER_ID;
    let nextPageToken = '';
    const allFiles = [];
    while (true) {
      const result = await this.utilsGDrive.listFiles({
        pageSize: 500,
        q: `"${searchFolderID}" in parents and trashed=false`,
        pageToken: nextPageToken || '',
        fields: 'nextPageToken, files(id, name, modifiedTime, createdTime)',
      });
      const files = result.files;
      if (files.length === 0) {
        console.log('No files found!!!');
        return;
      }
      for (const file of files) {
        allFiles.push({
          id: file.id,
          name: file.name,
          modTime: file.modifiedTime,
          createdTime: file.createdTime,
        });
      }
      nextPageToken = result.nextPageToken;
      if (nextPageToken === undefined) {
        break;
      }
    }
    return allFiles;
  }

  async downloadFiles(filesToDownload) {
    const promises = [];
    for (const file of filesToDownload) {
      promises.push(
        this.utilsGDrive.download(
          {
            fileId: file.id,
          },
          'temporary-images',
        ),
      );
    }
    return await Promise.all(promises);
  }
}

export const googleDrive = new GoogleDrive();
