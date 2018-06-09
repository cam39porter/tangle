import { getAuthenticatedUser } from "../../filters/request-context";
import * as elasticsearch from "elasticsearch";
import { SearchResponse } from "elasticsearch";
import { Capture } from "../../db/models/capture";
import { SearchResults } from "../models/search-results";
import { PageInfo } from "../models/page-info";

const client: elasticsearch.Client = new elasticsearch.Client({
  host:
    "https://elastic:Zbi0DfXL2ndo5dF62Jpgy4dz@291aaa2721c24901a5bf4f5152ccbe9a.europe-west1.gcp.cloud.es.io:9243/"
});

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  const esquery = {
    index: "neo4j-index-node",
    body: {
      from: start,
      size: count,
      query: {
        bool: {
          must: { match: { plainText: rawQuery } },
          filter: { match: { owner: userId } },
          must_not: { match: { archived: "true" } }
        }
      }
    }
  };
  return client.search(esquery).then((resp: SearchResponse<Capture>) => {
    const results: Capture[] = resp.hits.hits.map(
      record => record._source as Capture
    );
    return new SearchResults(
      results,
      new PageInfo(start, count, resp.hits.total)
    );
  });
}
