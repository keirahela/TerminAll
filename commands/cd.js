import {
  getCurrentDirectoryObject,
  changeDirectory,
  currentDirectory,
  fileSystem,
} from "../shared/currentDirectory.js";

export let BASE_PREFIX = "terminal@rm-rf";

let currentPath = document.getElementById("currentPath");

export default function cd(directory) {
  const currentDirObj = getCurrentDirectoryObject(currentDirectory);

  console.log(directory);
  if (directory == "" || directory == undefined) {
    changeDirectory("/home/terminal");
    updateCurrentPath();
    return "Changed directory to: /";
  }

  if (directory === "..") {
    const parentDir = currentDirectory.substring(
      0,
      currentDirectory.lastIndexOf("/")
    );
    changeDirectory(parentDir === "" ? "/" : parentDir);
    updateCurrentPath();
    return `Changed directory to: ${currentDirectory}`;
  } else if (directory.startsWith("/")) {
    const parts = directory.split("/").filter(Boolean);
    let newCurrentDir = fileSystem;

    for (const part of parts) {
      if (newCurrentDir[part]) {
        newCurrentDir = newCurrentDir[part];
      } else {
        return "No such directory: " + directory;
      }
    }

    changeDirectory(directory);
    updateCurrentPath();
    return `Changed directory to: ${currentDirectory}`;
  } else {
    const newCurrentDir = currentDirObj[directory];
    if (newCurrentDir) {
      changeDirectory(resolvePath(currentDirectory, directory));
      updateCurrentPath();
      return `Changed directory to: ${currentDirectory}`;
    } else {
      return "No such directory: " + directory;
    }
  }
}

function resolvePath(currentDir, directory) {
  if (directory.startsWith("/")) {
    return directory;
  } else if (directory === "..") {
    const parts = currentDir.split("/").filter(Boolean);
    parts.pop();
    return parts.length > 0 ? "/" + parts.join("/") : "/";
  } else if (directory === ".") {
    return currentDir;
  } else {
    return currentDir === "/" ? "/" + directory : currentDir + "/" + directory;
  }
}

function updateCurrentPath() {
  currentPath.innerText = `${BASE_PREFIX} ${
    currentDirectory.split("/").pop() === "terminal" ? "~" : currentDirectory
  } $`;
}

function checkIfExists(fs, dir) {
  const parts = dir.split("/").filter(Boolean);
  let current = fs;

  for (const part of parts) {
    if (current[part]) {
      current = current[part];
    } else {
      return false;
    }
  }

  return true;
}
