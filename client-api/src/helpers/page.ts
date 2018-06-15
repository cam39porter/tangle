import { PagingContext } from "../surface/models/paging-context";
import { CollectionResult } from "../surface/models/collection-result";
import { PagingInfo } from "../surface/models/paging-info";

// Assumes array was fetched with count + 1
export function transformFromCountPlusOne<T>(
  arr: T[],
  pagingContext: PagingContext,
  nextPageId: string,
  total?: number | null
): CollectionResult<T> {
  if (hasNextPage(arr, pagingContext.count)) {
    arr.pop();
    return new CollectionResult(arr, new PagingInfo(nextPageId, total));
  } else {
    return new CollectionResult(arr, new PagingInfo(null, total));
  }
}

function hasNextPage<T>(sessions: T[], count: number): boolean {
  return sessions.length > count;
}
