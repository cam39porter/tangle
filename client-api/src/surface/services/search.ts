import { getRandomCapture as getRandomCaptureClient } from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { search as searchClient } from "../clients/search";
import { Graph } from "../models/graph";
import { PageInfo } from "../models/page-info";
import { SearchResults } from "../models/search-results";
import { expandCapturesFetch } from "./expand";

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  if (!rawQuery || rawQuery.length === 0) {
    return getRandomCapture();
  } else {
    return searchClient(rawQuery, start, count)
      .then(captureIds => expandCapturesFetch(userId, captureIds))
      .then((graph: Graph) => {
        return new SearchResults(
          graph,
          new PageInfo(start, count, start + count)
        );
      });
  }
}

function getRandomCapture(): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  return getRandomCaptureClient(userId).then(capture =>
    expandCapturesFetch(userId, [capture.id]).then((graph: Graph) => {
      return new SearchResults(
        graph,
        new PageInfo(0, graph.nodes.length, graph.nodes.length)
      );
    })
  );
}
