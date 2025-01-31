let cursor = document.getElementById("cursor");
let userInput = document.getElementById("userinput");
let history = document.getElementById("history");
let currentPath = document.getElementById("currentPath");
let currentDirectory = "/";
let BASE_PREFIX = "terminal@rm-rf";
let commandHistory = [];
let historyIndex = -1;
let fileSystem = {
  home: {
    user1: {
      documents: { "doc1.txt": "Title: Egy macska élete! inf: ???", "doc2.txt": "Mewo, mewo meow meow?" },
      downloads: {},
      pictures: { "test.txt":"Jap megy csaó!", },
    },
    user2: {
      projects: {},
      music: {},
    },
    public: {},
  },
  etc: {
    config1: {},
    config2: {},
  },
  user: { "file1.txt": "File 1 contents", "file2.txt": "File 2 contents" },
  "README.txt": "Welcome to the Awesome Terminal App!\n This is a simple command-line application (CLI),\n designed to enhance your terminal experience with various utilities and features.",
  "DONOTREADME.txt": "Yap, you shouldn't this lil bro, now you are getting a virus!"
};
let commands = [
  "cal",
  "cat",
  "cd",
  "clear",
  "cp",
  "date",
  "echo",
  "find",
  "help",
  "logname",
  "ls",
  "mkdir",
  "mv",
  "pwd",
  "resetterm",
  "rm",
  "touch",
  "bcolor",
  "fcolor",
];

const specialKeys = [
  "Control",
  "Alt",
  "Shift",
  "CapsLock",
  "Escape",
  "Tab",
  "Space",
  "Enter",
  "Backspace",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Pause",
  "Insert",
  "Delete",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "NumLock",
  "ScrollLock",
  "PrintScreen",
  "ContextMenu",
  "Meta",
  "CapsLock",
  "OS",
  "AltGraph",
  "AudioVolumeMute",
  "AudioVolumeDown",
  "AudioVolumeUp",
  "MediaTrackNext",
  "MediaTrackPrevious",
  "MediaStop",
  "MediaPlayPause",
  "LaunchApplication1",
  "LaunchApplication2",
  "LaunchMail",
  "SelectMedia",
  "ZoomIn",
  "ZoomOut",
];

function cal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let calendar = `     ${months[month]} ${year}\n`;
  calendar += weekdays.join(" ") + "\n";

  let currentDay = 1;
  let line = "   ".repeat(firstDay);

  for (let i = firstDay; i < 7; i++) {
    line += String(currentDay).padStart(3, " ") + " ";
    currentDay++;
  }

  calendar += line.trim() + "\n";

  while (currentDay <= daysInMonth) {
    line = "";
    for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
      line += String(currentDay).padStart(3, " ") + " ";
      currentDay++;
    }
    calendar += line.trim() + "\n";
  }

  return calendar.trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearInput() {
  userInput.innerText = "";
}

function ls() {
  const currentDirObj = getCurrentDirectoryObject(currentDirectory);

  if (currentDirObj) {
    const entries = Object.keys(currentDirObj);
    return entries.length > 0
      ? entries.join("\n")
      : "Empty directory: " + currentDirectory;
  } else {
    return "No such directory: " + currentDirectory;
  }
}

function getCurrentDirectoryObject(currentDir) {
  const parts = currentDir.split("/").filter(Boolean);
  let current = fileSystem;

  for (const part of parts) {
    if (current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }
  return current;
}

function cd(directory) {
  const currentDirObj = getCurrentDirectoryObject(currentDirectory);

  if (directory === "..") {
    const parentDir = currentDirectory.substring(
      0,
      currentDirectory.lastIndexOf("/")
    );
    currentDirectory = parentDir === "" ? "/" : parentDir;
    updateCurrentPath();
    return `Changed directory to: ${currentDirectory}`;
  } else if (directory.startsWith("/")) {
    const parts = directory.split("/").filter(Boolean);
    let newCurrentDir = fileSystem;

    for (const part of parts) {
      if (newCurrentDir[part]) {
        newCurrentDir = newCurrentDir[part];
      } else {
        return "No such directory: " + directory;
      }
    }

    currentDirectory = directory;
    updateCurrentPath();
    return `Changed directory to: ${currentDirectory}`;
  } else {
    const newCurrentDir = currentDirObj[directory];
    if (newCurrentDir) {
      currentDirectory = resolvePath(currentDirectory, directory);
      updateCurrentPath();
      return `Changed directory to: ${currentDirectory}`;
    } else {
      return "No such directory: " + directory;
    }
  }
}

function resolvePath(currentDir, directory) {
  if (directory.startsWith("/")) {
    return directory;
  } else if (directory === "..") {
    const parts = currentDir.split("/").filter(Boolean);
    parts.pop();
    return parts.length > 0 ? "/" + parts.join("/") : "/";
  } else if (directory === ".") {
    return currentDir;
  } else {
    return currentDir === "/" ? "/" + directory : currentDir + "/" + directory;
  }
}

function updateCurrentPath() {
  currentPath.innerText = `${BASE_PREFIX} ${
    currentDirectory.split("/").pop() === ""
      ? "~"
      : currentDirectory.split("/").pop()
  } $`;
}

function checkIfExists(fs, dir) {
  const parts = dir.split("/").filter(Boolean);
  let current = fs;

  for (const part of parts) {
    if (current[part]) {
      current = current[part];
    } else {
      return false;
    }
  }

  return true;
}

function pwd() {
  return `Current directory: ${currentDirectory}`;
}

function clear() {
  while (history.firstChild) {
    history.removeChild(history.firstChild);
  }
  return "";
}

let possibleOptions = ["r", "i", "f", "v"];

function removeFile(file, recursive, interactive, force, verbose) {
  console.log(file, recursive, interactive, force, verbose);
}

function rm(command) {
  let args = command.split(" ");
  args.shift();

  let options = "";

  if (args[0].includes("-")) {
    options = args[0];
  }

  const parameters = options.split("");

  removeFile(
    args[1],
    parameters.includes("r"),
    parameters.includes("i"),
    parameters.includes("f"),
    parameters.includes("v")
  );
}

function cat(filename) {
  const newCurrentDir = getCurrentDirectoryObject(currentDirectory);
  if (newCurrentDir && newCurrentDir[filename]) {
    const fileContent = newCurrentDir[filename];
    if (typeof fileContent === "string") {
      return fileContent.split("\n").join("\n");
    } else {
      return `cat: ${filename}: Is a directory`;
    }
  } else {
    return `cat: ${filename}: No such file`;
  }
}

function touch(filename) {
  if (!filename) {
    return "Usage: touch <filename>";
  }
  const currentDirObj = getCurrentDirectoryObject(currentDirectory);
  if (currentDirObj) {
    if (!currentDirObj.hasOwnProperty(filename)) {
      currentDirObj[filename] = "";
      return `touch: Created file '${filename}'`;
    } else {
      return `touch: File '${filename}' already exists`;
    }
  } else {
    return `touch: No such directory`;
  }
}

function handleCommand(command) {
  let args = command.split(" ");
  let cmd = args[0];

  switch (cmd) {
    case "help":
      return "Supported commands: " + commands.join(", ");
    case "ls":
      return ls();
    case "cd":
      return cd(args[1]);
    case "pwd":
      return pwd();
    case "cal":
      return cal();
    case "clear":
      return clear();
    case "bcolor":
      return bcolor(args[1]);
    case "fcolor":
      return fcolor(args[1]);
    case "currentcar":
      return currentcar();
    case "echo":
      return echo(args);
    case "date":
      return date();
    case "logname":
      return BASE_PREFIX.split("@")[0];
    case "rm":
      return rm(command);
    case "cat":
      return cat(args[1]);
    case "touch":
      return touch(args[1])
    case "":
      return "";
    default:
      return "Unsupported command: " + command;
  }
}

function bcolor(color) {
  if (CSS.supports("color", color)) {
    document.getElementById("body").style.backgroundColor = color;
    return "Background color successfully changed!";
  } else {
    return "Syntax error: bcolor <color>";
  }
}

function date() {
  return new Date();
}

function echo(text) {
  let string = "";
  for (let i = 1; text.length > i; i++) {
    if (string == "") string = string + text[i];
    else string = string + " " + text[i];
  }
  return string;
}

function fcolor(color) {
  if (CSS.supports("color", color)) {
    document.getElementById("commands").style.color = color;
    return "Font color successfully changed!";
  } else {
    return "Syntax error: fcolor <color>";
  }
}

function currentcar() {
  return "Ha autót szeretnél bérleni vagy kiadni, akkor látogass el a currentcar.hu -ra!";
}

function submitCommand(command) {
  if (command.trim() === "") return;
  commandHistory.push(command);
  historyIndex = commandHistory.length;

  window.scrollTo(0, document.body.scrollHeight);
  clearInput();
  let history2 = document.createElement("span");
  history2.innerText = currentPath.innerText + " " + command;
  let span = document.createElement("span");
  span.innerText = handleCommand(command);
  history.appendChild(history2);
  history.appendChild(span);
}

document.addEventListener("keydown", function (event) {
  window.scrollTo(0, document.body.scrollHeight);
  if (event.key == "Enter") {
    submitCommand(userInput.innerText);
    return;
  } else if (event.key == "Backspace") {
    userInput.innerText = userInput.innerText.slice(0, -1);
    return;
  } else if (event.key == " ") {
    userInput.innerText += " ";
    return;
  } else if (event.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      userInput.innerText = commandHistory[historyIndex];
    }
    return;
  } else if (event.key === "ArrowDown") {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      userInput.innerText = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      userInput.innerText = "";
    }
    return;
  }

  if (specialKeys.includes(event.key)) return;
  cursor.innerText = "-";
  userInput.innerText += event.key;
});

async function toggleCursor() {
  while (true) {
    cursor.innerText = cursor.innerText == "" ? "-" : "";
    await sleep(600);
  }
}

toggleCursor();