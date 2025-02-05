export default function fcolor(color) {
  if (CSS.supports("color", color)) {
    document.getElementById("commands").style.color = color;
    return "Font color successfully changed!";
  } else {
    return "Syntax error: fcolor <color>";
  }
}
