import { getAuthenticatedUser } from "../../filters/request-context";
import * as elasticsearch from "elasticsearch";
import { SearchResponse as ESResponse } from "elasticsearch";
import { Capture } from "../../db/models/capture";
import { SearchResponse } from "../models/search-response";
import { PagingContext } from "../models/paging-context";
import { CollectionResult } from "../models/collection-result";
import { PagingInfo } from "../models/paging-info";
import { CaptureUrn } from "../../urn/capture-urn";
import { Param, executeQuery } from "../../db/db";
import { SessionUrn } from "../../urn/session-urn";
import { Logger } from "../../util/logging/logger";

const LOGGER = new Logger("src/surface/clients/search.ts");

const ELASTIC_HOST = `https://${process.env.ELASTIC_URI}:9243/`;

const client: elasticsearch.Client = new elasticsearch.Client({
  host: ELASTIC_HOST
});

export function search(
  rawQuery: string,
  capturePagingContext: PagingContext,
  sessionPagingContext: PagingContext
): Promise<SearchResponse> {
  return Promise.all([
    searchCaptures(rawQuery, capturePagingContext),
    searchSessions(rawQuery, sessionPagingContext)
  ]).then(promises => {
    const capturePromise = promises[0];
    const sessionPromise = promises[1];
    return new SearchResponse(capturePromise, sessionPromise);
  });
}

function searchSessions(
  rawQuery: string,
  sessionPagingContext: PagingContext
): Promise<CollectionResult<SessionUrn>> {
  const userId = getAuthenticatedUser().urn;
  const start = parseFloat(sessionPagingContext.pageId);
  const query = `
  MATCH (s:Session {owner:{userId}})
  WHERE TOLOWER(s.title) CONTAINS TOLOWER({rawQuery})
  WITH collect(s)[{start}..{end}] as sessions, COUNT(*) as total
  UNWIND sessions as session
  RETURN session, total
  ORDER BY LENGTH (session.title)
  `;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("rawQuery", rawQuery),
    new Param("start", start),
    new Param("end", start + sessionPagingContext.count)
  ];
  return executeQuery(query, params).then(res => {
    const sessionIds = res.records.map(record => {
      return SessionUrn.fromRaw(record.get("session").properties["id"]);
    });
    const total = res.records[0] ? res.records[0].get("total") : 0;
    const nextSessionPageId =
      start + sessionPagingContext.count < total
        ? (start + sessionPagingContext.count).toString()
        : null;
    const ret = new CollectionResult(
      sessionIds,
      new PagingInfo(nextSessionPageId, total)
    );
    return ret;
  });
}

function searchCaptures(rawQuery: string, capturePagingContext: PagingContext) {
  const userId = getAuthenticatedUser().urn;
  const start = parseFloat(capturePagingContext.pageId);
  const query = `
  MATCH (c:Capture {owner:{userId}})
  WHERE TOLOWER(c.body) CONTAINS TOLOWER({rawQuery})
  WITH collect(c)[{start}..{end}] as captures, COUNT(*) as total
  UNWIND captures as capture
  RETURN capture, total
  ORDER BY capture.created
  `;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("rawQuery", rawQuery),
    new Param("start", start),
    new Param("end", start + capturePagingContext.count)
  ];
  return executeQuery(query, params).then(res => {
    const captureIds = res.records.map(record => {
      return CaptureUrn.fromRaw(record.get("capture").properties["id"]);
    });
    const total = res.records[0] ? res.records[0].get("total") : 0;
    const nextCapturePageId =
      start + capturePagingContext.count < total
        ? (start + capturePagingContext.count).toString()
        : null;
    const ret = new CollectionResult(
      captureIds,
      new PagingInfo(nextCapturePageId, total)
    );
    return ret;
  });
}

//@ts-ignore
// Used for elastic search if we ever set that up again
function searchCapturesES(
  rawQuery: string,
  capturePagingContext: PagingContext
): Promise<CollectionResult<CaptureUrn>> {
  const userUrns = getAuthenticatedUser().readPermissionedUsers;
  const userClauses = userUrns.map(userUrn => {
    return { term: { "owner.keyword": userUrn.toRaw() } };
  });
  const start = parseFloat(capturePagingContext.pageId);
  const esquery = {
    index: "neo4j-index-capture",
    body: {
      from: start,
      size: capturePagingContext.count,
      query: {
        bool: {
          must: {
            match: { plainText: rawQuery }
          },
          filter: {
            bool: {
              should: userClauses
            }
          }
        }
      }
    }
  };
  return client
    .search(esquery)
    .then((resp: ESResponse<Capture>) => {
      const results: CaptureUrn[] = resp.hits.hits.map(record =>
        CaptureUrn.fromRaw(record._source["id"])
      );
      const nextCapturePageId =
        start + capturePagingContext.count < resp.hits.total
          ? (start + capturePagingContext.count).toString()
          : null;
      return new CollectionResult(
        results,
        new PagingInfo(nextCapturePageId, resp.hits.total)
      );
    })
    .catch(err => {
      LOGGER.error(err);
      throw err;
    });
}
