import { currentDirectory } from "../shared/currentDirectory.js";

export default function pwd() {
  return `Current directory: ${currentDirectory}`;
}
