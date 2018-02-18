const capture = require("./capture-resolver");

export const resolvers = {
  Query: {
    Capture: () => capture.getCapture()
  },
  Mutation: {
    createCapture: (_, { body }, context) => {
      return capture.createCapture(body);
    }
  }
};
