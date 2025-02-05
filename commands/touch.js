import {
  getCurrentDirectoryObject,
  currentDirectory,
} from "../shared/currentDirectory.js";
export default function touch(filename) {
  if (!filename) {
    return "Usage: touch <filename>";
  }
  const currentDirObj = getCurrentDirectoryObject(currentDirectory);
  if (currentDirObj) {
    if (!currentDirObj.hasOwnProperty(filename)) {
      currentDirObj[filename] = "";
      return `touch: Created file '${filename}'`;
    } else {
      return `touch: File '${filename}' already exists`;
    }
  } else {
    return `touch: No such directory`;
  }
}
