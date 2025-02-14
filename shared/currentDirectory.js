export function getCurrentDirectoryObject(currentDir) {
  const parts = currentDir.split("/").filter(Boolean);
  let current = fileSystem;

  for (const part of parts) {
    if (part === ".") {
      continue;
    } else if (part === "..") {
      current = current.parent || current;
    } else if (current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }

  return current;
}

export let currentDirectory = "/home/terminal";

export function changeDirectory(currentDir) {
  currentDirectory = currentDir;
}

export let fileSystem = {
  etc: {
    config1: {
      "config.json": '{"key":"value"}',
      "script.sh": '#!/bin/bash\necho "Hello World"',
    },
    config2: {
      "config.properties": "key=value",
      "data.csv": "data,hello,world\n1,2,3",
    },
    group: {},
    "host.conf": "",
    hosts: "127.0.0.1\tdashboard.example.com\ndatabase.example.com",
    motd: "Hello and welcome to the terminal",
  },
  lib: {
    "module1.js": "",
    "module2.js": "",
    "module3.js": "",
  },
  mnt: {
    usbdrive: {
      "file1.txt": "File 1 on USB drive",
      "file2.txt": "File 2 on USB drive",
    },
  },
  proc: {
    cpuinfo: "",
    meminfo: "",
    stat: "",
  },
  run: {
    "script.sh": '#!/bin/bash\necho "Hello World"',
  },
  tmp: {
    "file1.txt": "",
    "file2.txt": "",
  },
  var: {
    log: {
      "file1.log": "",
      "file2.log": "",
    },
    mail: {
      inbox: "",
      sentmail: "",
    },
  },
  home: {
    terminal: {
      documents: {
        "doc1.txt": "Title: Egy macska élete! inf: ???",
        "doc2.txt": "Mewo, mewo meow meow?",
        "report.pdf": "This is a report on cat behavior",
        "thesis.docx": "This is a thesis on cat behavior",
      },
      downloads: {
        "image1.jpg": "An image of a cat",
        "image2.png": "An image of a dog",
        "video1.mp4": "A video of a cat playing",
      },
      pictures: {
        "test.txt": "Jap megy csaó!",
        "cat.jpg": "A picture of a cat",
        "dog.jpg": "A picture of a dog",
      },
    },
    user2: {
      projects: {
        "project1.zip": "A project related to cat behavior",
        "project2.tar.gz": "A project related to dog behavior",
      },
      music: {
        "song1.mp3": "A song about cats",
        "song2.mp3": "A song about dogs",
      },
    },
    public: {
      "public_doc.txt": "A public document",
      "public_image.jpg": "A public image",
    },
  },
  user: {
    "file1.txt": "File 1 contents",
    "file2.txt": "File 2 contents",
    "file3.txt": "File 3 contents",
  },
  "README.txt":
    "Welcome to the Awesome Terminal App!\n This is a simple command-line application (CLI),\n designed to enhance your terminal experience with various utilities and features.",
  "DONOTREADME.txt":
    "Yap, you shouldn't this lil bro, now you are getting a virus!",
  folder1: {
    "file4.txt": "File 4 contents",
    folder2: {
      "file5.txt": "File 5 contents",
      folder3: {
        "file6.txt": "File 6 contents",
      },
    },
  },
};
