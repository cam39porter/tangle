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
import { SearchResults } from "../models/search-results";
import { expandCaptures } from "./expand";
import { SortListBy } from "../../types";

export function getNode(urn: string): Promise<SearchResults> {
  if (getUrnType(urn) === "capture") {
    return getCapture(urn);
  } else {
    return getOthers(urn);
  }
}

export function getAllByUseCase(
  useCase: string,
  timezoneOffset: number
): Promise<SearchResults> {
  if (useCase === "CAPTURED_TODAY") {
    return getAllCapturedToday(timezoneOffset);
  } else if (useCase === "MOST_RECENT") {
    return getAllMostRecent();
  } else if (useCase === "RANDOM") {
    return getAllRandom();
  } else {
    throw new NotImplementedError(
      "Get all currently only supports use cases; CAPTURED_TODAY, MOST_RECENT, and RANDOM"
    );
  }
}

function getAllRandom(): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  return getRandomCapture(userId).then(capture => {
    return expandCaptures(userId, [capture.id], null, SortListBy.DESC);
  });
}

function getAllMostRecent(): Promise<SearchResults> {
  const LIMIT = 10;
  const userId = getAuthenticatedUser().id;
  return getMostRecent(userId, LIMIT).then(captures => {
    const captureIds = captures.map(c => c.id);
    return expandCaptures(userId, captureIds, null, SortListBy.DESC);
  });
}

function getAllCapturedToday(timezoneOffset: number): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const since = getCreatedSince(timezoneOffset);
  return getAllSince(userId, since).then(captures => {
    const captureIds = captures.map(c => c.id);
    return expandCaptures(userId, captureIds, null, SortListBy.DESC);
  });
}

function getOthers(urn: string): Promise<SearchResults> {
  const userUrn = getAuthenticatedUser().id;
  switch (getUrnType(urn)) {
    case "session":
      return getCapturesByRelatedNode(userUrn, urn).then(captures =>
        expandCaptures(userUrn, captures.map(c => c.id), null, SortListBy.ASC)
      );
    default:
      return getCapturesByRelatedNode(userUrn, urn).then(captures =>
        expandCaptures(userUrn, captures.map(c => c.id))
      );
  }
}

function getCapture(urn: string): Promise<SearchResults> {
  const userUrn = getAuthenticatedUser().id;
  return getCaptureClient(userUrn, urn).then(capture =>
    expandCaptures(userUrn, [capture.id])
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
