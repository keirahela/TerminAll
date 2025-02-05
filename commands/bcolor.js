export default function bcolor(color) {
  if (CSS.supports("color", color)) {
    document.getElementById("body").style.backgroundColor = color;
    return "Background color successfully changed!";
  } else {
    return "Syntax error: bcolor <color>";
  }
}
