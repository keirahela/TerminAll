import bcolor from "./commands/bcolor.js";
import cal from "./commands/calendar.js";
import cat from "./commands/cat.js";
import cd, { BASE_PREFIX } from "./commands/cd.js";
import clear from "./commands/clear.js";
import echo from "./commands/echo.js";
import fcolor from "./commands/fcolor.js";
import locate from "./commands/locate.js";
import ls from "./commands/ls.js";
import pwd from "./commands/pwd.js";
import rm from "./commands/rm.js";
import touch from "./commands/touch.js";
import cp from "./commands/cp.js";
import resetterm from "./commands/resetterm.js";
import { specialKeys } from "./utils/blockedKeybinds.js";
import { sleep } from "./utils/helpers.js";
import mkdir from "./commands/mkdir.js";
import mv from "./commands/mv.js";
import {
  currentDirectory,
  getCurrentDirectoryObject,
} from "./shared/currentDirectory.js";
let cursor = document.getElementById("cursor");
let userInput = document.getElementById("userinput");
let history = document.getElementById("history");
let currentPath = document.getElementById("currentPath");
let commandHistory = [];
let historyIndex = -1;
let cursorPosition = 0;
let commands = [
  "cal",
  "cat",
  "cd",
  "clear",
  "cp",
  "date",
  "echo",
  "locate",
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
    case "cat":
      return cat(args[1]);
    case "cal":
      return cal();
    case "cd":
      return cd(args[1]);
    case "cp":
      return cp(command);
    case "mkdir":
      return mkdir(command);
    case "mv":
      return mv(command);
    case "clear":
      return clear();
    case "resetterm":
      return resetterm();
    case "date":
      return date();
    case "echo":
      return echo(args);
    case "locate":
      return locate(args[1]);
    case "help":
      return "Supported commands: " + commands.join(", ");
    case "logname":
      return BASE_PREFIX.split("@")[0];
    case "ls":
      return ls(args[1]);
    case "pwd":
      return pwd();
    case "rm":
      return rm(command);
    case "touch":
      return touch(args[1]);
    case "bcolor":
      return bcolor(args[1]);
    case "fcolor":
      return fcolor(args[1]);
    case "currentcar":
      return currentcar();
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

function writeToFile(name, content) {
  const directory = getCurrentDirectoryObject(currentDirectory);

  if (!directory) {
    return `Error: The current directory does not exist. Cannot write to ${name}`;
  }

  const fileName = name.split("/").pop();

  directory[fileName] = content;

  console.log(directory);

  return `Wrote to file ${fileName}`;
}

function submitCommand(command) {
  if (command.trim() === "") return;
  commandHistory.push(command);
  historyIndex = commandHistory.length;

  clearInput();

  let history2 = document.createElement("span");
  let span = document.createElement("span");

  history2.innerText = currentPath.innerText + " " + command;
  let result = handleCommand(command);
  span.innerText = result;
  let toFile = command.split("> ")[1];
  if (toFile) {
    span.innerText = writeToFile(
      toFile,
      result.split(" > ")[0].replace(/["']/g, "")
    );
  }

  history.appendChild(history2);
  history.appendChild(span);
  window.scrollTo(0, document.body.scrollHeight);
}

function updateCursor() {
  let inputSpan = document.getElementById("userinput");
  
  let text = inputSpan.textContent;
  
  let highlightedText = "";

  for (let characterIndex = 0; characterIndex < text.length; characterIndex++) {
    if (characterIndex === cursorPosition) {
      highlightedText += `<span class="cursor-highlight">${text[characterIndex]}</span>`;
    } else {
      highlightedText += text[characterIndex];
    }
  }

  if (cursorPosition === text.length) {
    highlightedText += `<span class="cursor-highlight">&nbsp;</span>`;
  }

  let tempSpan = document.createElement("span");

  tempSpan.innerHTML = highlightedText;

  inputSpan.replaceChildren(...tempSpan.childNodes);
}

document.addEventListener("keydown", function (event) {
  window.scrollTo(0, document.body.scrollHeight);
  if (event.key == "Enter") {
    let subcom = userInput.textContent.substring(0, userInput.textContent.length - 1);
    submitCommand(subcom);
    cursorPosition = 0;

    updateCursor();
    return;
  } else if (event.key == "Backspace" && cursorPosition > 0) {
    userInput.textContent = userInput.textContent.slice(0, cursorPosition - 1) + userInput.textContent.slice(cursorPosition);
    cursorPosition--;

    updateCursor();
    return;
  }else if (event.key === "Delete" && cursorPosition < userInput.textContent.length) {
    userInput.textContent = userInput.textContent.slice(0, cursorPosition) + userInput.textContent.slice(cursorPosition + 1);
    updateCursor();
    return;
  } else if (event.key === " ") {
    event.preventDefault();
    if(cursorPosition > 0){
      userInput.textContent = userInput.textContent.slice(0, cursorPosition) + " " + userInput.textContent.slice(cursorPosition);
      cursorPosition++;

      updateCursor();
    }
    return;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      userInput.innerText = commandHistory[historyIndex];
      cursorPosition = userInput.innerText.length;
    }

    updateCursor();
    return;
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      userInput.innerText = commandHistory[historyIndex];
      cursorPosition = userInput.innerText.length;
    } else {
      historyIndex = commandHistory.length;
      userInput.innerText = "";
      cursorPosition = 0;  
    }

    updateCursor();
    return;
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    cursorPosition = Math.max(0, cursorPosition - 1);

    updateCursor();
    return;
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    cursorPosition = Math.min(userInput.textContent.length-1, cursorPosition + 1);
    
    updateCursor();
    return;
  } else if (!specialKeys.includes(event.key) && event.key.length === 1) {
    userInput.textContent = userInput.textContent.slice(0, cursorPosition) + event.key + userInput.textContent.slice(cursorPosition);
    cursorPosition++;
  }
  updateCursor();
});

updateCursor();