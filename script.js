let cursor = document.getElementById("cursor");
let userInput = document.getElementById("userinput");
let history = document.getElementById("history");
let currentPath = document.getElementById("currentPath");
let currentDirectory = "/";
let fileSystem = {
  "/": ["home", "etc", "user", "README.txt"],
  "/home": ["user1", "user2", "public"],
  "/home/user1": ["documents", "downloads", "pictures"],
  "/home/user2": ["projects", "music"],
  "/etc": ["config1", "config2"],
  "/user": ["file1.txt", "file2.txt"],
  "/home/user1/documents": ["doc1.txt", "doc2.txt"],
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
  if (fileSystem[currentDirectory]) {
    return fileSystem[currentDirectory].join("\n");
  } else {
    return "No such directory: " + currentDirectory;
  }
}

function cd(directory) {
  if (directory === "..") {
    const parentDir = currentDirectory.substring(
      0,
      currentDirectory.lastIndexOf("/")
    );
    currentDirectory = parentDir === "" ? "/" : parentDir;
    currentPath.innerText = `terminal@rm-rf ${
      currentDirectory.split("/").pop() == ""
        ? "~"
        : currentDirectory.split("/").pop()
    } $`;
    return `Changed directory to: ${currentDirectory}`;
  }

  if (directory.startsWith("/")) {
    if (fileSystem[directory]) {
      currentDirectory = directory;
      currentPath.innerText = `terminal@rm-rf ${
        directory.split("/").pop() == "" ? "~" : directory.split("/").pop()
      } $`;
      return `Changed directory to: ${currentDirectory}`;
    } else {
      return `No such directory: ${directory}`;
    }
  } else {
    const newDirectory = currentDirectory + "/" + directory;
    const normalizedDirectory = newDirectory.replace(/\/+/g, "/");

    if (fileSystem[normalizedDirectory]) {
      currentDirectory = normalizedDirectory;
      currentPath.innerText = `terminal@rm-rf ${
        currentDirectory.split("/").pop() == ""
          ? "~"
          : currentDirectory.split("/").pop()
      } $`;
      return `Changed directory to: ${currentDirectory}`;
    } else {
      return `No such directory: ${directory}`;
    }
  }
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
    case "":
      return "";
    default:
      return "Unsupported command: " + command;
  }
}

function submitCommand(command) {
  window.scrollTo(0, document.body.scrollHeight);
  clearInput();
  let span = document.createElement("span");
  span.innerText = handleCommand(command);

  if (command == "") return;
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
