import {
  getCurrentDirectoryObject,
  fileSystem,
  currentDirectory,
} from "../shared/currentDirectory.js";

function mvCommand(source, destination) {
  const fullSourcePath = `${currentDirectory}/${source}`;
  const fullDestinationPath = `${currentDirectory}/${destination}`;

  let sourceObj = getCurrentDirectoryObject(
    source.lastIndexOf("/") == -1 ? currentDirectory : source
  );
  console.log(sourceObj, fullSourcePath);
  const destinationDir = getCurrentDirectoryObject(
    destination.lastIndexOf("/") == -1 ? fullDestinationPath : destination
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
  let current = fileSystem;

  for (let i = 0; i < sourceParts.length - 1; i++) {
    current = current[sourceParts[i]];
  }
  const sourceItemName = sourceParts[sourceParts.length - 1];
  delete current[sourceItemName];

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
