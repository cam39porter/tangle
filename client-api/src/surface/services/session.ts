import { PagingContext } from "../models/paging-context";
import { Session } from "../../db/models/session";
import { getAuthenticatedUser } from "../../filters/request-context";
import {
  getMostRecent,
  get as getBackendSession
} from "../../db/services/session";
import { CollectionResult } from "../models/collection-result";
import { SessionUrn } from "../../urn/session-urn";
import { transformFromCountPlusOne } from "../../helpers/page";

export function getRecentSessions(
  pagingContext: PagingContext
): Promise<CollectionResult<Session>> {
  const userUrn = getAuthenticatedUser().urn;
  const before = pagingContext.pageId
    ? parseInt(pagingContext.pageId, 10)
    : null;
  return getMostRecent(userUrn, before, pagingContext.count + 1).then(
    sessions => {
      return transformFromCountPlusOne(
        sessions,
        pagingContext,
        sessions.length > 0 ? sessions.slice(-1)[0].created.toString() : null,
        null
      );
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
