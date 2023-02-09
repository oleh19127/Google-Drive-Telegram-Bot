import { random } from "../random/random.js";
import { removeDuplicateFromArray } from "./remove-duplicate-from-array.js";

export const getIdOnly = async (howMatch) => {
  const randomFiles = await random.filesFromGoogleDrive(howMatch);
  const idOnly = [];
  for (const randomFile of randomFiles) {
    idOnly.push(randomFile.id);
  }
  return removeDuplicateFromArray(idOnly);
};
