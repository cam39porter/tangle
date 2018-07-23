import { SurfaceResults } from "./models/surface-results";
import {
  getNode,
  getAllMostRecent,
  getMostRecentCaptures
} from "./services/graph";
import { search, searchV2 } from "./services/search";
import { PageInfo } from "./models/page-info";
import { Urn } from "../urn/urn";
import { CollectionResult } from "./models/collection-result";
import { getRecentSessions, getSession } from "./services/session";
import { PagingContext } from "./models/paging-context";
import { SessionUrn } from "../urn/session-urn";
import { Session } from "../db/models/session";
import { Capture } from "../db/models/capture";
import { getRelatedCapturesBySession } from "./services/expand";
import { SearchResults } from "./models/search-results";
import { getStorageUsed } from "./services/settings";

export default {
  Query: {
    search(
      // @ts-ignore
      parent,
      { rawQuery, start, count },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SurfaceResults> {
      return search(rawQuery, start, count);
    },
    searchV2(
      // @ts-ignore
      parent,
      // @ts-ignore
      { rawQuery, capturePagingContext, sessionPagingContext },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SearchResults> {
      return searchV2(
        rawQuery,
        new PagingContext(
          (capturePagingContext && capturePagingContext.pageId) || 0,
          (capturePagingContext && capturePagingContext.count) || 10
        ),
        new PagingContext(
          (sessionPagingContext && sessionPagingContext.pageId) || 0,
          (sessionPagingContext && sessionPagingContext.count) || 10
        )
      );
    },

    // @ts-ignore
    getDetailed(parent, { id }, context, info): Promise<SurfaceResults> {
      return getNode(Urn.fromRaw(id));
    },
    // @ts-ignore
    getSettings(parent, _params, context, info): Promise<Settings> {
      return getStorageUsed();
    },
    getMostRecent(
      // @ts-ignore
      parent,
      { start, count },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SurfaceResults> {
      return getAllMostRecent(new PagingContext(start.toString(), count)).then(
        searchResults => {
          searchResults.pageInfo = new PageInfo(start, count, null);
          return searchResults;
        }
      );
    },
    getRecentSessions(
      // @ts-ignore
      parent,
      { pagingContext },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<CollectionResult<Session>> {
      return getRecentSessions(pagingContext || PagingContext.DEFAULT);
    },
    getSession(
      // @ts-ignore
      parent,
      // @ts-ignore
      { id, itemsPagingContext },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<Session> {
      return getSession(
        SessionUrn.fromRaw(id),
        itemsPagingContext || PagingContext.DEFAULT
      );
    },
    getRelatedCapturesBySession(
      // @ts-ignore
      parent,
      // @ts-ignore
      { id, pagingContext },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<CollectionResult<Capture>> {
      return getRelatedCapturesBySession(
        SessionUrn.fromRaw(id),
        pagingContext || PagingContext.INTERVAL_DEFAULT
      );
    },
    getRecentCaptures(
      // @ts-ignore
      parent,
      // @ts-ignore
      { pagingContext },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<CollectionResult<Capture>> {
      return getMostRecentCaptures(pagingContext || PagingContext.DEFAULT);
    }
  },
  SessionItem: {
    __resolveType(): string {
      return "Capture";
    }
  },
  Capture: {
    id(capture: Capture): string {
      return capture.urn.toRaw();
    }
  },
  Session: {
    id(session: Session): string {
      return session.urn.toRaw();
    }
  }
};
