import { PageInfo, Capture, CaptureCollection } from "../models";
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
        const captureArr: Capture[] = captures.map(
          captureDAO => new Capture(captureDAO)
        );
        const collection: CaptureCollection = new CaptureCollection(
          // TODO cole move paging to mysql
          captureArr.slice(params.start, params.start + params.count),
          new PageInfo(params.start, params.count, captureArr.length)
        );
        return collection;
      });
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Capture> {
      const capture = new Capture(params);
      return insertCapture(capture).then(id =>
        // TODO cmccrack extract to capture service
        getCapture(id).then(captureDAO => {
          return new Capture(captureDAO);
        })
      );
    }
  }
};
