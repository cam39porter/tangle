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

const client: elasticsearch.Client = new elasticsearch.Client({
  host:
    "https://elastic:Zbi0DfXL2ndo5dF62Jpgy4dz@291aaa2721c24901a5bf4f5152ccbe9a.europe-west1.gcp.cloud.es.io:9243/"
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

function searchCaptures(
  rawQuery: string,
  capturePagingContext: PagingContext
): Promise<CollectionResult<CaptureUrn>> {
  const userId = getAuthenticatedUser().urn;
  const start = parseFloat(capturePagingContext.pageId);
  const esquery = {
    index: "neo4j-index-node",
    body: {
      from: start,
      size: capturePagingContext.count,
      query: {
        bool: {
          must: { match: { plainText: rawQuery } },
          filter: { match: { owner: userId.toRaw() } },
          must_not: { match: { archived: "true" } }
        }
      }
    }
  };
  return client.search(esquery).then((resp: ESResponse<Capture>) => {
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
  });
}
