import { getCurrentDirectoryObject } from "../shared/currentDirectory.js";

function copyFile(src, dest) {
    const srcFile = getCurrentDirectoryObject(src);
    const destDir = getCurrentDirectoryObject(dest);

    if (srcFile && destDir) {
        const fileName = src.split('/').pop();
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
        const dirName = src.split('/').pop();
        destDir[dirName] = {};

        for (const [key, value] of Object.entries(srcDir)) {
            const newSrc = `${src}/${key}`;
            const newDest = `${dest}/${dirName}`;

            if (typeof value === 'object') {
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

    if (args.length < 3 || (args[1] !== '-rR')) {
        return "cp: missing -rR flag or invalid syntax. Usage: cp -rR <source> <destination>";
    }

    const dest = args[3];
    const src = args[2];
    const sourceDir = getCurrentDirectoryObject(src);
    const sourceFile = getCurrentDirectoryObject(src);

    if (sourceDir) {
        return copyDirectory(src, dest);
    } else if (sourceFile) {
        return copyFile(src, dest);
    } else {
        return `cp: ${src}: No such file or directory`;
    }
}
