import {
  currentDirectory,
  getCurrentDirectoryObject,
} from "../shared/currentDirectory.js";

function copyFile(src, dest) {
  const srcFile = getCurrentDirectoryObject(src);
  const destDir = getCurrentDirectoryObject(dest);

  if (srcFile && destDir) {
    const fileName = src.split("/").pop();
    destDir[fileName] = srcFile;
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
  console.log(args);
  let dest = args[2];
  let src = args[1];
  if (args[1] === "-rR" && args.length >= 3) {
    dest = args[3];
    src = args[2];
  }
  const sourceDir = getCurrentDirectoryObject(src);
  const sourceFile = getCurrentDirectoryObject(currentDirectory);
  console.log(typeof sourceFile[src]);
  if (sourceDir && typeof sourceDir == "object") {
    if (args[1] === "-rR" && args.length >= 3) {
      return copyDirectory(args[2], args[3]);
    } else {
      return "cp: missing -rR flag to copy directory. Usage: cp -rR <source> <destination>";
    }
  } else if (src in sourceFile) {
    return copyFile(src, dest);
  } else {
    return `cp: ${src}: No such file or directory`;
  }
}
