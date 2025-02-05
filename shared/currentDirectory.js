export function getCurrentDirectoryObject(currentDir) {
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

export let currentDirectory = "/";

export let fileSystem = {
  home: {
    user1: {
      documents: {
        "doc1.txt": "Title: Egy macska élete! inf: ???",
        "doc2.txt": "Mewo, mewo meow meow?",
      },
      downloads: {},
      pictures: { "test.txt": "Jap megy csaó!" },
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
  "README.txt":
    "Welcome to the Awesome Terminal App!\n This is a simple command-line application (CLI),\n designed to enhance your terminal experience with various utilities and features.",
  "DONOTREADME.txt":
    "Yap, you shouldn't this lil bro, now you are getting a virus!",
};
