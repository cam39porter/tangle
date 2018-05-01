import { executeQuery } from "../../db/db";
import { getAuthenticatedUser } from "../../filters/request-context";
import { search as searchClient } from "../clients/search";
import { buildGraph } from "../formatters/graph";
import { PageInfo } from "../models/page-info";
import { SearchResults } from "../models/search-results";
import { expandCaptures, expandCapturesFetch } from "./expand";

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  if (!rawQuery || rawQuery.length === 0) {
    return getAllRandomCapture();
  } else {
    return searchClient(rawQuery, start, count)
      .then(captureIds => expandCapturesFetch(userId, captureIds))
      .then(res => {
        return new SearchResults(
          buildGraph(
            res.records[0].get("nodes"),
            res.records[0].get("relationships"),
            null,
            res.records[0].get("roots")
          ),
          new PageInfo(start, count, start + count)
        );
      });
  }
}

function getAllRandomCapture(): Promise<SearchResults> {
  const userId = getAuthenticatedUser().id;
  return executeQuery(
    `MATCH (roots:Capture)<-[created:CREATED]-(user:User {id:"${userId}"})
    WHERE NOT EXISTS (roots.archived) OR roots.archived = false
    WITH roots, rand() as number
    ORDER BY number
    LIMIT 1
    ${expandCaptures(userId)}
    RETURN roots, nodes, relationships
    `
  ).then(res => {
    return new SearchResults(
      buildGraph(
        res.records[0].get("nodes"),
        res.records[0].get("relationships"),
        null,
        res.records[0].get("roots")
      ),
      new PageInfo(
        0,
        res.records[0].get("nodes").length,
        res.records[0].get("nodes").length
      )
    );
  });
}
