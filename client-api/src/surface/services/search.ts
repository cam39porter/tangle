import { batchGetCaptures } from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { search as searchClient } from "../clients/search";
import { SurfaceResults } from "../models/surface-results";
import { expandCaptures } from "./expand";
import { PagingContext } from "../models/paging-context";
import { SearchResults } from "../models/search-results";
import { PageInfo } from "../models/page-info";
import { CollectionResult } from "../models/collection-result";
import { batchGetSessions } from "../../db/services/session";

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SurfaceResults> {
  const userId = getAuthenticatedUser().urn;
  return searchClient(
    rawQuery,
    new PagingContext(start.toString(), count),
    new PagingContext(start.toString(), count)
  ).then(searchResults => {
    return expandCaptures(userId, searchResults.captures.items, null).then(
      surfaceResults => {
        const pagingInfo = searchResults.captures.pagingInfo;
        surfaceResults.pageInfo = new PageInfo(
          parseFloat(pagingInfo.nextPageId),
          count,
          pagingInfo.total
        );
        return surfaceResults;
      }
    );
  });
}

export function searchV2(
  rawQuery: string,
  capturePagingContext: PagingContext,
  sessionPagingContext: PagingContext
): Promise<SearchResults> {
  const userId = getAuthenticatedUser().urn;
  return searchClient(
    rawQuery,
    capturePagingContext,
    sessionPagingContext
  ).then(searchResults => {
    return Promise.all([
      batchGetCaptures(userId, searchResults.captures.items),
      batchGetSessions(userId, searchResults.sessions.items)
    ]).then(promises => {
      const captures = promises[0];
      const sessions = promises[1];
      return new SearchResults(
        new CollectionResult(captures, searchResults.captures.pagingInfo),
        new CollectionResult(sessions, searchResults.sessions.pagingInfo)
      );
    });
  });
}
