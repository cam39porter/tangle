import { Capture } from "../models";
import {
  getCaptures,
  getCapture,
  insertCapture,
  search
} from "../db/gcloud-server";

export default {
  Query: {
    getCaptures(): Promise<Capture[]> {
      return getCaptures().then(captures => {
        return captures.map(captureDAO => new Capture(captureDAO));
      });
    },
    getCapture(_, params, context): Promise<Capture> {
      return getCapture(params.id).then(captureDAO => {
        return new Capture(captureDAO);
      });
    },
    search(_, params, context): Promise<Capture> {
      return search(params.rawQuery).then(captures => {
        return captures.map(captureDAO => new Capture(captureDAO));
      });
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Capture> {
      const capture = new Capture(params);
      return insertCapture(capture);
    }
  }
};
