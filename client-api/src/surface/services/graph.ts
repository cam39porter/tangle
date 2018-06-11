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
import { getUrnType } from "../../db/helpers/urn-helpers";
import { NotImplementedError } from "../../util/exceptions/not-implemented-error";
import { SurfaceResults } from "../models/surface-results";
import { expandCaptures } from "./expand";
import { formatCapture, formatNode } from "../formatters/graph-node";
import { CaptureUrn } from "../../urn/capture-urn";

export function getNode(urn: string): Promise<SurfaceResults> {
  if (getUrnType(urn) === "capture") {
    return getCapture(CaptureUrn.fromRaw(urn));
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
  start: number,
  count: number
): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().urn;
  return getMostRecent(userUrn, start, count).then(captures => {
    const captureUrns = captures.map(c => c.urn);
    return expandCaptures(userUrn, captureUrns, null);
  });
}

function getAllCapturedToday(timezoneOffset: number): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().urn;
  const since = getCreatedSince(timezoneOffset);
  return getAllSince(userId, since).then(captures => {
    const captureUrns = captures.map(c => c.urn);
    return expandCaptures(userId, captureUrns, null);
  });
}

function getOthers(urn: string): Promise<SurfaceResults> {
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
