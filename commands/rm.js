import {
  currentDirectory,
  getCurrentDirectoryObject,
} from "../shared/currentDirectory.js";

function removeFile(file, recursive, interactive, force, verbose) {
  console.log(recursive, interactive, force, verbose);
  const fileSystem = getCurrentDirectoryObject(currentDirectory);

  if (!fileSystem) {
    if (verbose)
      return `Directory '${currentDirectory}' does not exist and cannot be deleted.`;
  }

  if (!fileSystem[file]) {
    if (verbose) return `File '${file}' does not exist and cannot be deleted.`;
  }

  const deleteDirectory = (dir) => {
    const files = Object.keys(fileSystem[dir]);
    if (files.length > 0) {
      if (interactive) {
        const confirm = window.confirm(
          `Are you sure you want to delete the directory '${dir}' and all its contents?`
        );
        if (!confirm) return;
      }

      files.forEach((f) => {
        if (fileSystem[f]) {
          deleteFile(f);
          return `Deleting directory '${f}'.`;
        } else {
          delete fileSystem[f];
          return `Deleting file '${f}'.`;
        }
      });
    }
    delete fileSystem[dir];
    return `Directory '${dir}' and all its contents successfully deleted.`;
  };

  if (fileSystem[file] instanceof Object) {
    if (recursive) {
      deleteDirectory(file);
    } else {
      return `Cannot delete directory '${file}' without recursive option.`;
    }
  } else {
    delete fileSystem[file];
    return `File '${file}' successfully deleted.`;
  }

  if (
    force &&
    fileSystem[file] instanceof Object &&
    Object.keys(fileSystem[file]).length === 0
  ) {
    delete fileSystem[file];
    return `Empty directory '${file}' forcibly deleted.`;
  } else if (fileSystem[file] instanceof Object) {
    return `Directory '${file}' is empty but not deleted.`;
  }

  return "";
}

export default function rm(command) {
  let args = command.split(" ");
  args.shift();

  let options = "";

  if (args[0].includes("-")) {
    options = args[0];
  }

  const parameters = options.split("");

  return removeFile(
    options != "" ? args[1] : args[0],
    parameters.includes("r"),
    parameters.includes("i"),
    parameters.includes("f"),
    parameters.includes("v")
  );
}
