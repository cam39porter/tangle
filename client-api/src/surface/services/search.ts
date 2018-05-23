import { getRandomCapture as getRandomCaptureClient } from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { search as searchClient } from "../clients/search";
import { SearchResults } from "../models/search-results";
import { expandCaptures } from "./expand";
import { SortListBy } from "../../types";

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
      return expandCaptures(
        userId,
        captureIds,
        null,
        SortListBy.NONE,
        `Search results for '${rawQuery}'`
      );
    });
  }
}

function getRandomCapture(): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  return getRandomCaptureClient(userId).then(capture =>
    expandCaptures(
      userId,
      [capture.id],
      null,
      SortListBy.NONE,
      `Focusing on the random capture below`
    )
  );
}
