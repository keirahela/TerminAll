import {
    getCurrentDirectoryObject,
    currentDirectory,
    fileSystem,
  } from "../shared/currentDirectory.js";
export default function find(directory) {
  let fileList = "";
  
  if(!directory) {
    return "Syntax error: find <directory>";
  }
  isDirectory(fileSystem[directory], Object.keys(fileSystem[directory]))
  let allFiles = Object.keys(fileSystem[directory]);
}

function isDirectory(directoryFind, directoryMaybe) {
  for (let i = 0; directory.length > i; i++) {
    if(directoryMaybe.hasOwnProperty()) {
      
    }
  }
}