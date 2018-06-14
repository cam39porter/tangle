import { PagingContext } from "../models/paging-context";
import { Session } from "../models/session";
import { Session as BackendSession } from "../../db/models/session";
import { getAuthenticatedUser } from "../../filters/request-context";
import { getMostRecent } from "../../db/services/session";
import { CollectionResult } from "../models/collection-result";
import { PagingInfo } from "../models/paging-info";

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
          sessions.map(formatFrontendSession),
          new PagingInfo(last.created.toString(), null)
        );
      } else {
        return new CollectionResult(
          sessions.map(formatFrontendSession),
          new PagingInfo(null, null)
        );
      }
    }
  );
}

function hasNextPage<T>(sessions: T[], count: number): boolean {
  return sessions.length > count;
}

function formatFrontendSession(backendSession: BackendSession): Session {
  return new Session(
    backendSession.urn.toRaw(),
    backendSession.title,
    backendSession.created
  );
}
