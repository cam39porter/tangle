import { Capture } from "../models";
import { getCaptures, getCapture, insertCapture } from "../db/gcloud-server";

export default {
  Query: {
    getCaptures(): Capture[] {
      return getCaptures().then(captures => {
        return captures.map(capture => new Capture(capture.id, capture.body));
      });
    },
    getCapture(_, params, context): Capture {
      return getCapture(params.id).then(captureDAO => {
        return new Capture(captureDAO.id, captureDAO.body);
      });
    }
  },
  Mutation: {
    createCapture(_, params, context): Capture {
      const capture = new Capture(null, params.body);
      return insertCapture(capture);
    }
  }
};
