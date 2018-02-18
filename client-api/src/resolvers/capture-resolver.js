let str = "cam is soft";
let defaultCapture = { body: str };

export const captureMethods = {
  getCapture: () => {
    return defaultCapture;
  },
  createCapture: body => {
    if (body != null) {
      defaultCapture = { body: body };
    }
    return defaultCapture;
  }
};
