import {
  getCurrentDirectoryObject,
  currentDirectory,
  fileSystem,
} from "../shared/currentDirectory.js";

export default function locate(fileName) {
  if (!fileName) {
    return "Syntax error: locate <fileName>";
  }

  const foundFiles = searchFiles(fileSystem, fileName, "");

  if (foundFiles.length === 0) {
    return `No file found named "${fileName}"`;
  }

  return `Files found with the name "${fileName}": \n${foundFiles.join("\n")}`;
}

function searchFiles(directoryObj, fileName, currentPath) {
  let results = [];

  for (let key in directoryObj) {
    if (directoryObj.hasOwnProperty(key)) {
      const entry = directoryObj[key];
      const newPath = currentPath ? `${currentPath}/${key}` : key;

      if (typeof entry === "object") {
        results.push(...searchFiles(entry, fileName, newPath));
      } else {
        if (key === fileName) {
          results.push(newPath);
        }
      }
    }
  }

  return results;
}
