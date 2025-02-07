import {
  getCurrentDirectoryObject,
  currentDirectory,
  fileSystem,
} from "../shared/currentDirectory.js";

export default function find(directory) {

  if (!directory) {
    return "Syntax error: find <directory>";
  }



  let currentDirectoryObj = getCurrentDirectoryObject(currentDirectory)

  if (currentDirectoryObj && currentDirectoryObj[directory]) {

    const allFiles = gatherFiles(currentDirectoryObj[directory]);


    if (allFiles.length === 0) {
      return `No files found in directory: ${directory}`;
    }

    return `Files found in ${directory}: \n${allFiles.join("\n")}`;
  } else {

    return `Directory not found: ${directory}`;
  }
}


function gatherFiles(directoryObj) {
  let files = [];


  for (let key in directoryObj) {
    if (directoryObj.hasOwnProperty(key)) {
      const entry = directoryObj[key];

      if (typeof entry === "object") {
        files.push(...gatherFiles(entry));
      } else {

        files.push(key);
      }
    }
  }

  return files;
}
