import { methodsWrapper } from "../methods-wrapper/methods-wrapper.js";
import { googleDrive } from "../google-drive/google-drive.js";

class Random {
  constructor() {
    this.colors = [
      "red",
      "green",
      "yellow",
      "blue",
      "magenta",
      "cyan",
      "white",
      "gray",
    ];
  }
  async color() {
    const randomColor = this.integer(this.colors.length);
    return this.colors[randomColor];
  }

  async filesFromGoogleDrive(howMatch) {
    const randomFiles = [];
    const allFiles = await methodsWrapper.init(
      googleDrive.getAllFiles,
      "Getting all files from google drive",
      []
    );
    for (let i = 0; i < howMatch; i++) {
      const randomFileNumber = this.integer(allFiles.length);
      randomFiles.push(allFiles[randomFileNumber]);
    }
    return randomFiles;
  }

  integer(max) {
    return Math.floor(Math.random() * max);
  }
}

export const random = new Random();
