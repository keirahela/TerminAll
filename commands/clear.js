let history = document.getElementById("history");
export default function clear() {
  while (history.firstChild) {
    history.removeChild(history.firstChild);
  }
  return "";
}
