export default function echo(text) {
  let string = "";
  for (let i = 1; text.length > i; i++) {
    if (string == "") string = string + text[i];
    else string = string + " " + text[i];
  }
  return string;
}
