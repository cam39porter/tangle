const { getCapture, createCapture } = require("./capture-resolver");

export default {
  Query: {
    Capture: () => getCapture()
  },
  Mutation: {
    createCapture: (_, { body }, context) => {
      return createCapture(body);
    }
  }
};
