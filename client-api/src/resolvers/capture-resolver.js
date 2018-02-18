let str = "cam is soft";
let defaultCapture = { body: str };

export function getCapture() {
  return defaultCapture;
}

export function createCapture(body) {
  if (body != null) {
    defaultCapture = { body: body };
  }
  return defaultCapture;
}
