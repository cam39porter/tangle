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
  startUrn = null,
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
  startUrn = null
): Promise<Graph> {
  const params = { userUrn, captureIds };
  const query = `
  MATCH (roots:Capture)
    WHERE roots.id IN {captureIds}
  WITH roots
  OPTIONAL MATCH (roots)-[r1:TAGGED_WITH|INCLUDES|REFERENCES|LINKS_TO|PREVIOUS|COMMENTED_ON]-(firstDegree)
    WHERE (firstDegree:Tag OR firstDegree:Entity OR firstDegree:Session OR firstDegree:Link OR firstDegree:Capture)
  OPTIONAL MATCH (firstDegree)-[r2:TAGGED_WITH|INCLUDES|REFERENCES|LINKS_TO]
    -(secondDegree:Capture)<-[:CREATED]-(u:User {id:{userUrn}})
    WHERE NOT EXISTS(secondDegree.archived) or secondDegree.archived = false
  WITH collect(roots) as roots, collect(roots)+collect(firstDegree)+collect(secondDegree) AS nodes,
    collect(distinct r1)+collect(distinct r2) AS relationships
  UNWIND nodes as node
  UNWIND relationships as relationship
  RETURN roots, collect(distinct node) as nodes, collect(distinct relationship) as relationships
  `;
  return executeQuery(query, params).then((result: StatementResult) => {
    if (result.records.length === 0) {
      return new Graph([], []);
    } else {
      return buildGraph(
        result.records[0].get("nodes"),
        result.records[0].get("relationships"),
        startUrn,
        formatCaptures(result.records[0].get("roots"))
      );
    }
  });
}

function expandList(
  userUrn: string,
  captureIds: string[],
  sortBy: SortListBy = SortListBy.NONE
): Promise<ListItem[]> {
  const params = { userUrn, captureIds };
  const query = `
  MATCH (roots:Capture)
    WHERE roots.id IN {captureIds}
  WITH roots
  OPTIONAL MATCH (roots)-[r1:TAGGED_WITH|INCLUDES|REFERENCES|LINKS_TO|PREVIOUS|COMMENTED_ON|DISMISSED_RELATION]-
    (firstDegree)
  WHERE (firstDegree:Tag OR firstDegree:Entity OR firstDegree:Session OR firstDegree:Link OR firstDegree:Capture)
  AND (NOT EXISTS(firstDegree.archived) or firstDegree.archived = false)
  OPTIONAL MATCH (firstDegree)-[r2:TAGGED_WITH|INCLUDES|REFERENCES|LINKS_TO]-
    (secondDegree:Capture)<-[:CREATED]-(u:User {id:{userUrn}})
    WHERE (NOT EXISTS(secondDegree.archived) or secondDegree.archived = false)
  RETURN roots, r1, firstDegree, r2, secondDegree
  `;
  return executeQuery(query, params).then((result: StatementResult) => {
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
    return buildList(paths, sortBy);
  });
}

function formatCaptures(nodes: Node[]): Capture[] {
  return nodes.map(node => node.properties as Capture);
}
