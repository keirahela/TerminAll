import {
  getCurrentDirectoryObject,
  currentDirectory,
} from "../shared/currentDirectory.js";
import { afterLast, beforeLast } from "../utils/helpers.js";

export default function touch(filename) {
  if (!filename) {
    return "Usage: touch <filename>";
  }
  const currentDirObj = getCurrentDirectoryObject(
    currentDirectory + "/" + beforeLast(filename, "/")
  );
  console.log(currentDirObj, filename);
  if (currentDirObj) {
    if (!currentDirObj.hasOwnProperty(afterLast(filename, "/"))) {
      currentDirObj[afterLast(filename, "/")] = "";
      return `touch: Created file '${afterLast(filename, "/")}'`;
    } else {
      return `touch: File '${afterLast(filename, "/")}' already exists`;
    }
  } else {
    return `touch: No such directory`;
  }
}
