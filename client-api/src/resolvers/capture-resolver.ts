let str: string = "cam is soft";
let defaultCapture: Object = { body: str };

export function getCapture() {
  return defaultCapture;
}

export function createCapture(body: string): Object {
  if (body != null) {
    defaultCapture = { body: body };
  }
  return defaultCapture;
}
