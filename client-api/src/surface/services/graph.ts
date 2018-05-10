import * as moment from "moment";
import {
  getAllSince,
  getCapture as getCaptureClient,
  getCapturesByRelatedNode
} from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { getUrnType } from "../../db/helpers/urn-helpers";
import { NotImplementedError } from "../../util/exceptions/not-implemented-error";
import { Graph } from "../models/graph";
import { PageInfo } from "../models/page-info";
import { SearchResults } from "../models/search-results";
import { expandCapturesFetch } from "./expand";

export function getNode(urn: string): Promise<Graph> {
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
  return getAllSince(userId, since).then(captures =>
    expandCapturesFetch(userId, captures.map(c => c.id)).then(graph => {
      return new SearchResults(
        graph,
        new PageInfo(0, graph.nodes.length, graph.nodes.length)
      );
    })
  );
}

function getOthers(urn: string): Promise<Graph> {
  const userUrn = getAuthenticatedUser().id;
  return getCapturesByRelatedNode(userUrn, urn).then(captures =>
    expandCapturesFetch(userUrn, captures.map(c => c.id))
  );
}

function getCapture(urn: string): Promise<Graph> {
  const userUrn = getAuthenticatedUser().id;
  return getCaptureClient(userUrn, urn).then(capture =>
    expandCapturesFetch(userUrn, [capture.id])
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
