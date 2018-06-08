import * as moment from "moment";
import {
  getAllSince,
  getCapture as getCaptureClient,
  getCapturesByRelatedNode,
  getMostRecent,
  getRandomCapture
} from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { getUrnType } from "../../db/helpers/urn-helpers";
import { NotImplementedError } from "../../util/exceptions/not-implemented-error";
import { SurfaceResults } from "../models/surface-results";
import { expandCaptures } from "./expand";

export function getNode(urn: string): Promise<SurfaceResults> {
  if (getUrnType(urn) === "capture") {
    return getCapture(urn);
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
  const userId = getAuthenticatedUser().id;
  return getRandomCapture(userId).then(capture => {
    return expandCaptures(userId, [capture.id], null);
  });
}

export function getAllMostRecent(
  start: number,
  count: number
): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().id;
  return getMostRecent(userId, start, count).then(captures => {
    const captureIds = captures.map(c => c.id);
    return expandCaptures(userId, captureIds, null);
  });
}

function getAllCapturedToday(timezoneOffset: number): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().id;
  const since = getCreatedSince(timezoneOffset);
  return getAllSince(userId, since).then(captures => {
    const captureIds = captures.map(c => c.id);
    return expandCaptures(userId, captureIds, null);
  });
}

function getOthers(urn: string): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().id;
  switch (getUrnType(urn)) {
    case "session":
      return getCapturesByRelatedNode(userUrn, urn).then(captures =>
        expandCaptures(userUrn, captures.map(c => c.id), urn)
      );
    default:
      return getCapturesByRelatedNode(userUrn, urn).then(captures => {
        return expandCaptures(userUrn, captures.map(c => c.id), urn);
      });
  }
}

function getCapture(urn: string): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().id;
  return getCaptureClient(userUrn, urn).then(capture =>
    expandCaptures(userUrn, [capture.id], null)
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
