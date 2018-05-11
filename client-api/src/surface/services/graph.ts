import * as moment from "moment";
import {
  getAllSince,
  getCapture as getCaptureClient,
  getCapturesByRelatedNode
} from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { getUrnType } from "../../db/helpers/urn-helpers";
import { NotImplementedError } from "../../util/exceptions/not-implemented-error";
import { SearchResults } from "../models/search-results";
import { expandCaptures } from "./expand";

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
  } else {
    throw new NotImplementedError(
      "Get all currently only supports useCase CAPTURED_TODAY"
    );
  }
}

function getAllCapturedToday(timezoneOffset: number): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const since = getCreatedSince(timezoneOffset);
  return getAllSince(userId, since).then(captures => {
    const captureIds = captures.map(c => c.id);
    return expandCaptures(userId, captureIds);
  });
}

function getOthers(urn: string): Promise<SearchResults> {
  const userUrn = getAuthenticatedUser().id;
  return getCapturesByRelatedNode(userUrn, urn).then(captures =>
    expandCaptures(userUrn, captures.map(c => c.id))
  );
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
