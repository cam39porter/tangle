import { PagingContext } from "../models/paging-context";
import { Session } from "../../db/models/session";
import { getAuthenticatedUser } from "../../filters/request-context";
import {
  getMostRecent,
  get as getBackendSession
} from "../../db/services/session";
import { CollectionResult } from "../models/collection-result";
import { PagingInfo } from "../models/paging-info";
import { SessionUrn } from "../../urn/session-urn";

export function getRecentSessions(
  pagingContext: PagingContext
): Promise<CollectionResult<Session>> {
  const userUrn = getAuthenticatedUser().urn;
  const before = pagingContext.pageId
    ? parseInt(pagingContext.pageId, 10)
    : null;
  return getMostRecent(userUrn, before, pagingContext.count + 1).then(
    sessions => {
      if (hasNextPage(sessions, pagingContext.count)) {
        const last = sessions.pop();
        return new CollectionResult(
          sessions,
          new PagingInfo(last.created.toString(), null)
        );
      } else {
        return new CollectionResult(sessions, new PagingInfo(null, null));
      }
    }
  );
}

export function getSession(
  sessionUrn: SessionUrn,
  itemsPagingContext: PagingContext
): Promise<Session> {
  const userUrn = getAuthenticatedUser().urn;
  return getBackendSession(userUrn, sessionUrn, itemsPagingContext);
}

function hasNextPage<T>(sessions: T[], count: number): boolean {
  return sessions.length > count;
}
