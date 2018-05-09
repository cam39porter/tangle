import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery } from "../../db/db";
import { buildGraph } from "../formatters/graph";
import { Graph } from "../models/graph";

export function expandCapturesFetch(
  userUrn: string,
  captureIds: string[],
  startUrn = null
): Promise<Graph> {
  const params = { userUrn, captureIds };
  const query = `
  MATCH (roots:Capture)
  WHERE roots.id IN {captureIds}
  WITH roots
  OPTIONAL MATCH (roots)-[r1]-(firstDegree)
  WHERE firstDegree:Tag OR firstDegree:Entity OR firstDegree:Session OR firstDegree:Link OR firstDegree:Capture
  OPTIONAL MATCH (firstDegree)-[r2]-(secondDegree:Capture)<-[:CREATED]-(u:User {id:{userUrn}})
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
        result.records[0].get("roots")
      );
    }
  });
}
