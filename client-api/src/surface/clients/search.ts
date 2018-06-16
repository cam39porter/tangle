import { getAuthenticatedUser } from "../../filters/request-context";
import * as elasticsearch from "elasticsearch";
import { SearchResponse as ESResponse } from "elasticsearch";
import { Capture } from "../../db/models/capture";
import { SearchResponse } from "../models/search-response";
import { PagingContext } from "../models/paging-context";
import { CollectionResult } from "../models/collection-result";
import { PagingInfo } from "../models/paging-info";
import { CaptureUrn } from "../../urn/capture-urn";

const client: elasticsearch.Client = new elasticsearch.Client({
  host:
    "https://elastic:Zbi0DfXL2ndo5dF62Jpgy4dz@291aaa2721c24901a5bf4f5152ccbe9a.europe-west1.gcp.cloud.es.io:9243/"
});

export function search(
  rawQuery: string,
  capturePagingContext: PagingContext
): Promise<SearchResponse> {
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
    return new SearchResponse(
      new CollectionResult(
        results,
        new PagingInfo(nextCapturePageId, resp.hits.total)
      ),
      null
    );
  });
}
