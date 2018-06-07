import { StatementResult, Node, Relationship } from "neo4j-driver/types/v1";
import { executeQuery } from "../../db/db";
import { buildGraph } from "../formatters/graph";
import { Graph } from "../models/graph";
import { Capture } from "../../db/models/capture";
import { ListItem } from "../models/list-item";
import { buildList } from "../formatters/list";
import { SearchResults } from "../models/search-results";
import { PageInfo } from "../models/page-info";
import { SortListBy } from "../../types";

export function expandCaptures(
  userUrn: string,
  captureIds: string[],
  startUrn: string = null,
  sortBy: SortListBy = SortListBy.NONE,
  header: string | null = null
): Promise<SearchResults> {
  const expansionPromises = Promise.all([
    expandGraph(userUrn, captureIds, startUrn),
    expandList(userUrn, captureIds, sortBy)
  ]);
  return expansionPromises.then(expansions => {
    const graph = expansions[0];
    const list = expansions[1];
    return new SearchResults(
      header,
      graph,
      list,
      new PageInfo(0, graph.nodes.length, graph.nodes.length)
    );
  });
}

function expandGraph(
  userUrn: string,
  captureIds: string[],
  startUrn: string = null
): Promise<Graph> {
  const params = { userUrn, captureIds, startUrn };
  const query = getExpansionQuery(startUrn, false);
  return executeQuery(query, params).then((result: StatementResult) => {
    return buildGraph(formatDbResponse(result));
  });
}

function expandList(
  userUrn: string,
  captureIds: string[],
  sortBy: SortListBy = SortListBy.NONE,
  startUrn: string = null
): Promise<ListItem[]> {
  const params = { userUrn, captureIds, startUrn };
  const query = getExpansionQuery(startUrn, true);
  return executeQuery(query, params).then((result: StatementResult) => {
    return buildList(formatDbResponse(result), sortBy);
  });
}

function formatDbResponse(
  result: StatementResult
): Array<[Capture, Relationship, Node, Relationship, Capture]> {
  const paths: Array<
    [Capture, Relationship, Node, Relationship, Capture]
  > = result.records.map(record => {
    const root: Capture = record.get("roots")
      ? (record.get("roots").properties as Capture)
      : (null as Capture);
    const r1: Relationship = record.get("r1") as Relationship;
    const intermediate: Node = record.get("firstDegree") as Node;
    const r2: Relationship = record.get("r2") as Relationship;
    const end: Capture = record.get("secondDegree")
      ? (record.get("secondDegree").properties as Capture)
      : (null as Capture);
    const ret: [Capture, Relationship, Node, Relationship, Capture] = [
      root,
      r1,
      intermediate,
      r2,
      end
    ];
    return ret;
  });
  return paths;
}

function getExpansionQuery(startUrn: string, listMode: boolean): string {
  return `
  MATCH (roots:Capture)
  WHERE roots.id IN {captureIds}
  WITH roots

  CALL apoc.cypher.run('
  OPTIONAL MATCH (roots)-[r1:TAGGED_WITH|INCLUDES|REFERENCES|LINKS_TO|PREVIOUS|COMMENTED_ON
    ${listMode ? "|DISMISSED_RELATION" : ""}]-
  (firstDegree)
  WHERE (firstDegree:Tag
    OR firstDegree:Entity
    OR firstDegree:Session OR firstDegree:Link OR firstDegree:Capture)
  AND (NOT EXISTS(firstDegree.archived) or firstDegree.archived = false)
  ${startUrn ? "AND (firstDegree.id <> startUrn)" : ""}
  RETURN r1, firstDegree
  ORDER BY r1.salience DESC LIMIT 5',
  {roots:roots, startUrn:{startUrn}}) YIELD value
  WITH roots, value.r1 as r1, value.firstDegree as firstDegree, collect(roots) as allRoots

  OPTIONAL MATCH (firstDegree)-[r2:TAGGED_WITH|REFERENCES|LINKS_TO]-
  (secondDegree:Capture)<-[:CREATED]-(u:User {id:{userUrn}})
  WHERE (NOT EXISTS(secondDegree.archived) or secondDegree.archived = false)
  RETURN roots, r1, firstDegree, r2, secondDegree
  `;
}
