
import { getCurrentDirectoryObject, fileSystem } from "../shared/currentDirectory.js";

function mvCommand(source, destination) {
    const sourceObj = getCurrentDirectoryObject(source);
    const destinationDir = getCurrentDirectoryObject(destination);

    if (!sourceObj) {
        return `mv: ${source}: No such file or directory`;
    }

    if (!destinationDir) {
        return `mv: ${destination}: No such directory`;
    }

    const name = source.split("/").pop();

    destinationDir[name] = sourceObj;

    const parts = source.split("/");
    let current = fileSystem;
    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    delete current[parts[parts.length - 1]];

    return `Moved ${name} from ${source} to ${destination}`;
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