import {
  getCurrentDirectoryObject,
  currentDirectory,
} from "../shared/currentDirectory.js";

export default function ls(flags = "") {
  const currentDirObj = getCurrentDirectoryObject(currentDirectory);

  if (!currentDirObj) {
    return "No such directory: " + currentDirectory;
  }

  const entries = Object.keys(currentDirObj);

  const showAll = flags.includes("-a");
  const filteredEntries = showAll
    ? entries
    : entries.filter((entry) => !entry.startsWith("."));

  if (flags.includes("-l") || flags.includes("-la")) {
    return filteredEntries
      .map((entry) => {
        const stats = currentDirObj[entry];
        const permissions =
          typeof stats == "object" ? "drwxr-xr-x" : "-rwxr--r--";
        const links = 1;
        const owner = "terminal";
        const group = "staff";
        const size = stats.size || 0;
        const modifiedDate = new Date();
        const formattedDate = `${modifiedDate.toLocaleString("en", {
          month: "short",
        })} ${modifiedDate.getDate()} ${modifiedDate.getHours()}:${
          (modifiedDate.getMinutes() < 10 ? "0" : "") +
          modifiedDate.getMinutes()
        }`;

        return `${permissions} ${links} ${owner} ${group} ${size} ${formattedDate} ${entry}`;
      })
      .join("\n");
  }

  return filteredEntries.length > 0
    ? filteredEntries.join("\n")
    : "Empty directory: " + currentDirectory;
}
