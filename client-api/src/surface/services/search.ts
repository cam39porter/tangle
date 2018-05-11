import { getRandomCapture as getRandomCaptureClient } from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { search as searchClient } from "../clients/search";
import { SearchResults } from "../models/search-results";
import { expandCaptures } from "./expand";

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  if (!rawQuery || rawQuery.length === 0) {
    return getRandomCapture();
  } else {
    return searchClient(rawQuery, start, count).then(captureIds => {
      return expandCaptures(userId, captureIds);
    });
  }
}

function getRandomCapture(): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  return getRandomCaptureClient(userId).then(capture =>
    expandCaptures(userId, [capture.id])
  );
}
