import {
  currentDirectory,
  getCurrentDirectoryObject,
} from "../shared/currentDirectory.js";
import { afterLast, beforeLast } from "../utils/helpers.js";

function copyFile(src, dest) {
  let srcFile = getCurrentDirectoryObject(currentDirectory);
  let destDir = getCurrentDirectoryObject(dest);

  let result = dest.indexOf("/");

  console.log(typeof srcFile[src] == "string");
  console.log(typeof srcFile[dest] == "object");

  if (typeof srcFile[src] == "string" && typeof srcFile[dest] == "object") {
    const fileName = src.split("/").pop();
    srcFile[dest][fileName] = srcFile[src];
    return `Copied ${fileName} to ${dest}`;
  } else if (typeof srcFile[src] == "string" && result != -1) {
    const fileName = src.split("/").pop();
    destDir[fileName] = srcFile[src];
    return `Copied ${fileName} to ${dest}`;
  } else {
    return `cp: ${src}: No such file or directory`;
  }
}

function copyDirectory(src, dest) {
  const srcDir = getCurrentDirectoryObject(src);
  const destDir = getCurrentDirectoryObject(dest);

  if (srcDir && destDir) {
    const dirName = src.split("/").pop();
    destDir[dirName] = {};

    for (const [key, value] of Object.entries(srcDir)) {
      const newSrc = `${src}/${key}`;
      const newDest = `${dest}/${dirName}`;

      if (typeof value === "object") {
        copyDirectory(newSrc, newDest);
      } else {
        copyFile(newSrc, newDest);
      }
    }

    return `Copied directory ${src} to ${dest}`;
  } else {
    return `cp: ${src}: No such directory`;
  }
}

export default function cp(command) {
  const args = command.split(" ");

  if (args.length < 2) {
    return "cp: invalid syntax. Usage: cp (-rR) <source> <destination>";
  }

  let src = args[1];
  let dest = args[2];

  if (args[1] === "-rR" && args.length >= 3) {
    dest = args[3];
    src = args[2];
  }

  const sourceDir = getCurrentDirectoryObject(currentDirectory);
  let sourceFile = sourceDir[src];
  console.log(sourceFile);

  if (sourceFile == undefined || sourceFile == null) {
    sourceFile = getCurrentDirectoryObject(
      currentDirectory + "/" + beforeLast(src, "/")
    );

    console.log(
      currentDirectory + "/" + beforeLast(src, "/") + "/",
      sourceFile
    );
    sourceFile = sourceFile ? sourceFile[afterLast(src, "/")] : undefined;
  }

  if (sourceFile == undefined || sourceFile == null) {
    return `cp: ${src}: No such file or directory`;
  }

  const destDir = getCurrentDirectoryObject(currentDirectory + "/" + dest);

  if (destDir == null || destDir == undefined) {
    return `cp: ${dest}: No such directory`;
  }

  if (destDir && typeof destDir === "object") {
    const fileName = src.split("/").pop();
    destDir[fileName] = sourceFile;
    return `Copied ${fileName} to ${dest}`;
  } else if (dest && typeof dest === "string") {
    const destParent = getCurrentDirectoryObject(
      currentDirectory + "/" + dest.split("/").slice(0, -1).join("/")
    );
    if (destParent && typeof destParent === "object") {
      const fileName = src.split("/").pop();
      destParent[fileName] = sourceFile;
      return `Copied ${fileName} to ${dest}`;
    } else {
      return `cp: ${dest}: No such directory`;
    }
  }

  return `cp: ${src}: No such file or directory`;
}
