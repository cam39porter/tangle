import * as moment from "moment";
import {
  getAllSince,
  getCapture as getCaptureClient,
  getCapturesByRelatedNode,
  getMostRecent,
  getRandomCapture,
  getUntypedNode
} from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { NotImplementedError } from "../../util/exceptions/not-implemented-error";
import { SurfaceResults } from "../models/surface-results";
import { expandCaptures } from "./expand";
import { formatCapture, formatNode } from "../formatters/graph-node";
import { CaptureUrn } from "../../urn/capture-urn";
import { Urn } from "../../urn/urn";
import { PagingContext } from "../models/paging-context";
import { transformFromCountPlusOne } from "../../helpers/page";
import { CollectionResult } from "../models/collection-result";
import { Capture } from "../../db/models/capture";

export function getNode(urn: Urn): Promise<SurfaceResults> {
  if (CaptureUrn.isCaptureUrn(urn)) {
    return getCapture(CaptureUrn.fromUrn(urn));
  } else {
    return getOthers(urn);
  }
}

export function getAllByUseCase(
  useCase: string,
  timezoneOffset: number
): Promise<SurfaceResults> {
  if (useCase === "CAPTURED_TODAY") {
    return getAllCapturedToday(timezoneOffset);
  } else if (useCase === "RANDOM") {
    return getAllRandom();
  } else {
    throw new NotImplementedError(
      "Get all currently only supports use cases; CAPTURED_TODAY, and RANDOM"
    );
  }
}

function getAllRandom(): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().urn;
  return getRandomCapture(userId).then(capture => {
    return expandCaptures(userId, [capture.urn], formatCapture(capture, true));
  });
}

export function getAllMostRecent(
  pagingContext: PagingContext
): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().urn;
  return getMostRecent(
    userUrn,
    parseFloat(pagingContext.pageId),
    pagingContext.count
  ).then(captures => {
    const captureUrns = captures.map(c => c.urn);
    return expandCaptures(userUrn, captureUrns, null);
  });
}

export function getMostRecentCaptures(
  pagingContext: PagingContext
): Promise<CollectionResult<Capture>> {
  const userUrn = getAuthenticatedUser().urn;
  const start = parseFloat(pagingContext.pageId);
  return getMostRecent(userUrn, start, pagingContext.count + 1).then(
    captures => {
      return transformFromCountPlusOne(
        captures,
        pagingContext,
        (start + pagingContext.count).toString()
      );
    }
  );
}

function getAllCapturedToday(timezoneOffset: number): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().urn;
  const since = getCreatedSince(timezoneOffset);
  return getAllSince(userId, since).then(captures => {
    const captureUrns = captures.map(c => c.urn);
    return expandCaptures(userId, captureUrns, null);
  });
}

function getOthers(urn: Urn): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().urn;
  return getUntypedNode(userUrn, urn).then(node => {
    return getCapturesByRelatedNode(userUrn, urn).then(captures => {
      return expandCaptures(
        userUrn,
        captures.map(c => c.urn),
        formatNode(node, true)
      );
    });
  });
}

function getCapture(urn: CaptureUrn): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().urn;
  return getCaptureClient(userUrn, urn).then(capture =>
    expandCaptures(userUrn, [capture.urn], formatCapture(capture, true))
  );
}

// TODO move to time helpers and unit test
function getCreatedSince(timezoneOffset: number): number {
  return (
    moment
      .utc()
      .add(timezoneOffset ? moment.duration(timezoneOffset, "hours") : 0)
      .startOf("day")
      .subtract(timezoneOffset ? moment.duration(timezoneOffset, "hours") : 0)
      .unix() * 1000
  );
}
