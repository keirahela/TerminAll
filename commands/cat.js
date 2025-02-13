import {
  currentDirectory,
  getCurrentDirectoryObject,
} from "../shared/currentDirectory.js";

export default function cat(filename) {
  const newCurrentDir = getCurrentDirectoryObject(currentDirectory);
  if (newCurrentDir && newCurrentDir[filename]) {
    const fileContent = newCurrentDir[filename];
    if (typeof fileContent === "string") {
      return fileContent.split("\n").join("\n");
    } else {
      return `cat: ${filename}: Is a directory`;
    }
  } else {
    return `cat: ${filename}: No such file, or file is empty`;
  }
}
