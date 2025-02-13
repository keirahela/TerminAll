import {
  getCurrentDirectoryObject,
  currentDirectory,
} from "../shared/currentDirectory.js";

function beforeLast(value, delimiter) {
  value = value || "";

  return delimiter === ""
    ? value
    : value.slice(0, value.lastIndexOf(delimiter));
}

function afterLast(value, delimiter) {
  value = value || "";

  return delimiter === "" ? value : value.split(delimiter).pop();
}

export default function touch(filename) {
  if (!filename) {
    return "Usage: touch <filename>";
  }
  const currentDirObj = getCurrentDirectoryObject(
    filename.lastIndexOf("/") == -1
      ? currentDirectory
      : beforeLast(filename, "/")
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
