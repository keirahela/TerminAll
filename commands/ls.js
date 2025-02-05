import {
  getCurrentDirectoryObject,
  currentDirectory,
} from "../shared/currentDirectory.js";
export default function ls() {
  const currentDirObj = getCurrentDirectoryObject(currentDirectory);

  if (currentDirObj) {
    const entries = Object.keys(currentDirObj);
    return entries.length > 0
      ? entries.join("\n")
      : "Empty directory: " + currentDirectory;
  } else {
    return "No such directory: " + currentDirectory;
  }
}
