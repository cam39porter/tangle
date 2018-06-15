import { SurfaceResults } from "./models/surface-results";
import { getAllByUseCase, getNode, getAllMostRecent } from "./services/graph";
import { search } from "./services/search";
import { PageInfo } from "./models/page-info";
import { Urn } from "../urn/urn";
import { CollectionResult } from "./models/collection-result";
import { getRecentSessions, getSession } from "./services/session";
import { PagingContext } from "./models/paging-context";
import { SessionUrn } from "../urn/session-urn";
import { Session } from "../db/models/session";
import { Capture } from "../db/models/capture";
import { getRelatedCapturesBySession } from "./services/expand";

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
    // @ts-ignore
    getDetailed(parent, { id }, context, info): Promise<SurfaceResults> {
      return getNode(Urn.fromRaw(id));
    },
    getAll(
      // @ts-ignore
      parent,
      { useCase, timezoneOffset },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<SurfaceResults> {
      return getAllByUseCase(useCase, timezoneOffset);
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
      return getAllMostRecent(start, count).then(searchResults => {
        searchResults.pageInfo = new PageInfo(start, count, null);
        return searchResults;
      });
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
