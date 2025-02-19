export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function beforeLast(value, delimiter) {
  value = value || "";

  return delimiter === ""
    ? value
    : value.slice(0, value.lastIndexOf(delimiter));
}

export function afterLast(value, delimiter) {
  value = value || "";

  return delimiter === "" ? value : value.split(delimiter).pop();
}
