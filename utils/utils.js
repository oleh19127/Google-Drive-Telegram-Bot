import arrayUnion from 'array-union';
import random from 'random';
import { glob } from 'glob';
import { deleteAsync } from 'del';
class Utils {
  async getRandomPhotos(array, times) {
    let randomFiles = [];
    while (true) {
      const element = random.choice(array);
      randomFiles.push(element);
      randomFiles = arrayUnion(randomFiles);
      if (randomFiles.length === times) {
        return randomFiles;
      }
    }
  }

  async getAllImageNamesFromTmpFolder() {
    return await glob('temporary-images/**/*.webp', {
      nodir: true,
    });
  }

  async deleteAllPhotosFromTmpFolder() {
    return await deleteAsync(['temporary-images/**/*.webp'], {
      onlyFiles: true,
    });
  }

  async sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}

export const utils = new Utils();
