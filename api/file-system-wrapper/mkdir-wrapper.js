import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

class MkdirWrapper {
  async init(tmpFolder) {
    if (!existsSync(tmpFolder)) {
      console.log(`Created path: ${tmpFolder}`);
      return await mkdir(tmpFolder, { recursive: true });
    }
  }
}

const mkdirWrapper = new MkdirWrapper();

export { mkdirWrapper };
