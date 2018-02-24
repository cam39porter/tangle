import { Capture } from "../models";

let defaultCapture: Capture = new Capture("cam is soft");

export default {
  Query: {
    getCapture(): Capture {
      return defaultCapture;
    }
  },
  Mutation: {
    createCapture(_, params, context): Capture {
      defaultCapture = new Capture(params.body);
      return defaultCapture;
    }
  }
};
