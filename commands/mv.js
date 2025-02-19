import {
  getCurrentDirectoryObject,
  fileSystem,
  currentDirectory,
} from "../shared/currentDirectory.js";
import { afterLast, beforeLast } from "../utils/helpers.js";

function mvCommand(source, destination) {
  const fullSourcePath = `${currentDirectory}/${source}`;
  const fullDestinationPath = `${currentDirectory}/${destination}`;

  let sourceObj = getCurrentDirectoryObject(
    currentDirectory + "/" + beforeLast(source, "/")
  );
  console.log(sourceObj, fullSourcePath);
  const destinationDir = getCurrentDirectoryObject(
    currentDirectory + "/" + destination
  );

  if (!sourceObj) {
    return `mv: ${source}: No such file or directory`;
  }

  sourceObj = sourceObj[source];

  if (!destinationDir || typeof destinationDir !== "object") {
    return `mv: ${destination}: No such directory`;
  }

  const name = source.split("/").pop();

  console.log(name);

  console.log(destinationDir);

  destinationDir[name] = sourceObj;

  const sourceParts = fullSourcePath.split("/").filter(Boolean);
  delete sourceObj[afterLast(source, "/")];

  return `Moved ${name} succesfully`;
}

export default function mv(command) {
  const args = command.split(" ");

  if (args.length < 3) {
    return "mv: missing operands. Usage: mv <source> <destination>";
  }

  const source = args[1];
  const destination = args[2];

  return mvCommand(source, destination);
}
