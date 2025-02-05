import bcolor from "./commands/bcolor.js";
import cal from "./commands/calendar.js";
import cat from "./commands/cat.js";
import cd, { BASE_PREFIX } from "./commands/cd.js";
import clear from "./commands/clear.js";
import echo from "./commands/echo.js";
import fcolor from "./commands/fcolor.js";
import ls from "./commands/ls.js";
import pwd from "./commands/pwd.js";
import rm from "./commands/rm.js";
import touch from "./commands/touch.js";
import { specialKeys } from "./utils/blockedKeybinds.js";
import { sleep } from "./utils/helpers.js";
let cursor = document.getElementById("cursor");
let userInput = document.getElementById("userinput");
let history = document.getElementById("history");
let currentPath = document.getElementById("currentPath");
let commandHistory = [];
let historyIndex = -1;
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

function clearInput() {
  userInput.innerText = "";
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
      return touch(args[1]);
    case "":
      return "";
    default:
      return "Unsupported command: " + command;
  }
}

function date() {
  return new Date();
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
  let span = document.createElement("span");

  history2.innerText = currentPath.innerText + " " + command;
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
    event.preventDefault();

    if (historyIndex > 0) {
      historyIndex--;
      userInput.innerText = commandHistory[historyIndex];
    }
    return;
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
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
