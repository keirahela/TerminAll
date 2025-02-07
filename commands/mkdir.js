import { getCurrentDirectoryObject, fileSystem, currentDirectory } from "../shared/currentDirectory.js";

function mkdirCommand(directoryPath) {
    console.log(currentDirectory + directoryPath)
    const currentDirObj = getCurrentDirectoryObject(currentDirectory);

    if (currentDirObj && currentDirObj[directoryPath]) {
        return `mkdir: ${directoryPath}: Directory already exists`;
    }

    currentDirObj[directoryPath] = {};

    return `Directory created: ${currentDirectory}/${directoryPath}`;
}

export default function mkdir(command) {
    const args = command.split(" ");
    if (args.length < 2) {
        return "mkdir: missing operand. Usage: mkdir <directory>";
    }

    const directoryPath = args[1];

    return mkdirCommand(directoryPath);
}