import { getRandomCapture as getRandomCaptureClient } from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { search as searchClient } from "../clients/search";
import { SurfaceResults } from "../models/surface-results";
import { expandCaptures } from "./expand";

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().id;
  if (!rawQuery || rawQuery.length === 0) {
    return getRandomCapture();
  } else {
    return searchClient(rawQuery, start, count).then(searchResults => {
      return expandCaptures(
        userId,
        searchResults.results.map(capture => capture.urn),
        null
      ).then(surfaceResults => {
        surfaceResults.pageInfo = searchResults.pageInfo;
        return surfaceResults;
      });
    });
  }
}

function getRandomCapture(): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().id;
  return getRandomCaptureClient(userId).then(capture =>
    expandCaptures(userId, [capture.urn], null)
  );
}
