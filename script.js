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
let header = document.getElementById("header");
let commandHistory = [];
let historyIndex = -1;
let cursorPosition = 0;
let isNano = false;
let fileName = "";
let fileChanged = false;
let textLines;
let currentLine;
let cursorColumn = 0;
let text;
let beforeCursor;
let lineStart;
let lineEnd;
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
  "nano",
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
      return ls(args[1], args[2]);
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
    case "nano":
      return nano(args[1]);
    case "currentcar":
      return currentcar();
    case "":
      return "";
    default:
      return "Unsupported command: " + command;
  }
}

function nano(filename) {
  let currentDirObj = getCurrentDirectoryObject(currentDirectory);
  if (!currentDirObj) {
      return `Error: Directory does not exist: ${currentDirectory}`;
  }

  isNano = true;
  fileName = filename;
  userInput.style.display = "block";
  header.style.display = "none";
  history.style.display = "none";
  currentPath.style.display = "none";
  userInput.style.whiteSpace = "pre-wrap";

  if (currentDirObj[filename]) {
      userInput.textContent = currentDirObj[filename];
  } else {
      userInput.textContent = "";
  }
  cursorPosition = userInput.textContent.length;
  fileChanged = false;
  updateCursor();

  return;
}

function date() {
  return new Date();
}

function currentcar() {
  return "Ha autót szeretnél bérleni vagy kiadni, akkor látogass el a currentcar.hu -ra!";
}

function writeToFile(name, content) {
  let currentDirObj = getCurrentDirectoryObject(currentDirectory);
  if (!currentDirObj) {
    return `Error: Directory does not exist: ${currentDirectory}`;
  }

  currentDirObj[name] = content;
  return `Wrote to file ${name}`;
}

function submitCommand(command) {
  if (!isNano) {
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
function returnUpdate(){
  updateCursor();
  return;
}

function textLinesSum(){
  textLines = userInput.textContent.split("\n");
  currentLine = userInput.textContent.substring(0, cursorPosition).split("\n").length - 1;
  text = userInput.textContent;
  beforeCursor = text.substring(0, cursorPosition);
  lineStart = beforeCursor.lastIndexOf("\n") + 1;
  lineEnd = lineStart + textLines[currentLine].length;
}

document.addEventListener("keydown", function (event) {
  window.scrollTo(0, document.body.scrollHeight);

  if (event.key == "Enter") {
    if(isNano){
      event.preventDefault();
      userInput.textContent =
          userInput.textContent.slice(0, cursorPosition) +
          "\n" +
          userInput.textContent.slice(cursorPosition);
      cursorPosition++;
      fileChanged = true;

        if (event.key.length === 1 && !event.ctrlKey && !specialKeys.includes(event.key)) {
          fileChanged = true;
        }   
    } else{
      let subcom = userInput.textContent.substring(
        0,
        userInput.textContent.length - 1
      );
      submitCommand(subcom);
      cursorPosition = 0;
    }

    returnUpdate()
  } 
  
  else if (event.key == "Backspace" && cursorPosition > 0) {
        userInput.textContent =
        userInput.textContent.slice(0, cursorPosition - 1) +
        userInput.textContent.slice(cursorPosition);

      cursorPosition--;

    returnUpdate()
  } 
  
  else if (event.key === "Delete" && cursorPosition < userInput.textContent.length) {
    userInput.textContent =
      userInput.textContent.slice(0, cursorPosition) +
      userInput.textContent.slice(cursorPosition + 1);

    returnUpdate()
  } 
  
  else if (event.key === " ") {
    event.preventDefault();
    if (cursorPosition > 0) {
      userInput.textContent =
        userInput.textContent.slice(0, cursorPosition) +
        " " +
        userInput.textContent.slice(cursorPosition);
      cursorPosition++;
    }

    returnUpdate()
  } 
  
  else if (event.key === "ArrowUp") {
    event.preventDefault();
    if(isNano){
      textLinesSum();
      if (currentLine > 0) {
        let prevLineLength = textLines[currentLine - 1].length;
        let newPosition = Math.min(cursorColumn, prevLineLength);
        cursorPosition = textLines.slice(0, currentLine - 1).join("\n").length + newPosition + (currentLine > 1 ? 1 : 0);
      }
    }
    else{
      if (historyIndex > 0) {
        historyIndex--;
        userInput.innerText = commandHistory[historyIndex];
        cursorPosition = userInput.innerText.length;
      }
    }

    returnUpdate()
  } 
  
  else if (event.key === "ArrowDown") {
    event.preventDefault();
    if(isNano){
      textLinesSum();
      if (currentLine < textLines.length - 1) {
        let nextLineLength = textLines[currentLine + 1].length;
        let newPosition = Math.min(cursorColumn, nextLineLength);
        cursorPosition = textLines.slice(0, currentLine + 1).join("\n").length + newPosition + 1;
      }
    } else{
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        userInput.innerText = commandHistory[historyIndex];
        cursorPosition = userInput.innerText.length;
      } else {
        historyIndex = commandHistory.length;
        userInput.innerText = "";
        cursorPosition = 0;
      }
    }

    returnUpdate()
  } 
  
  else if (event.key === "ArrowLeft") {
    event.preventDefault();
    cursorPosition = Math.max(0, cursorPosition - 1);

    returnUpdate()
  } 
  
  else if (event.key === "ArrowRight") {
    event.preventDefault();
    cursorPosition = Math.min(
      userInput.textContent.length - 1,
      cursorPosition + 1
    );

    returnUpdate()
  } 
  
  else if (event.ctrlKey && event.key === 'x' && isNano) {
    event.preventDefault();
    if (fileChanged) {
          if (confirm("Do you want to save changes?")) {
              let currentDirObj = getCurrentDirectoryObject(currentDirectory);
              if (currentDirObj) {
                  currentDirObj[fileName] = userInput.textContent;
              }
          }
    }
    isNano = false;
    header.style.display = "block";
    history.style.display = "flex";
    currentPath.style.display = "inline";
    userInput.style.display = "inline";
    userInput.textContent = "";
    cursorPosition = 0;

    returnUpdate()
    } 
    
  else if (event.ctrlKey && event.key === 'o' && isNano) {
        event.preventDefault();
        let currentDirObj = getCurrentDirectoryObject(currentDirectory);
        if (currentDirObj) {
            currentDirObj[fileName] = userInput.textContent;
            fileChanged = false;
            alert(`File saved: ${fileName}`);
        }
      return;
    } 
    
  else if (!specialKeys.includes(event.key) && event.key.length === 1) {
    userInput.textContent =
      userInput.textContent.slice(0, cursorPosition) +
      event.key +
      userInput.textContent.slice(cursorPosition);
    cursorPosition++;
  }
  updateCursor();
});

updateCursor();