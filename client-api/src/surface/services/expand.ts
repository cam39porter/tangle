import { StatementResult } from "neo4j-driver/types/v1";
import { executeQueryWithParams } from "../../db/db";
import { buildGraph } from "../formatters/graph";
import { Graph } from "../models/graph";

/**
 * TODO instead of providing a cypher query, this function should perform the db lookup
 * and take in a list of ids to expand.
 * Generates a piece of a cypher query that will expand a set of captures,
 * called "roots" to their second degree connections
 * @param userUrn the id of the user requesting
 * @returns two collections in cypher, called "nodes", and "relationship". The caller is responsible for returning these
 */
export function expandCaptures(userUrn: string): string {
  return `OPTIONAL MATCH (roots:Capture)-[r1]-(firstDegree)
  WHERE firstDegree:Tag OR firstDegree:Entity OR firstDegree:Session OR firstDegree:Link
  OPTIONAL MATCH (firstDegree)-[r2]-(secondDegree:Capture)<-[:CREATED]-(u:User {id:"${userUrn}"})
  WHERE NOT EXISTS(secondDegree.archived) or secondDegree.archived = false
  WITH roots, collect(roots)+collect(firstDegree)+collect(secondDegree) AS nodes,
  collect(distinct r1)+collect(distinct r2) AS relationships
  UNWIND nodes as node
  UNWIND relationships as rel
  WITH collect(distinct roots) as roots, collect(distinct node) as nodes, collect(distinct rel) as relationships
  `;
}

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
  OPTIONAL MATCH (roots:Capture)-[r1]-(firstDegree)
  WHERE firstDegree:Tag OR firstDegree:Entity OR firstDegree:Session OR firstDegree:Link
  OPTIONAL MATCH (firstDegree)-[r2]-(secondDegree:Capture)<-[:CREATED]-(u:User {id:{userUrn}})
  WHERE NOT EXISTS(secondDegree.archived) or secondDegree.archived = false
  WITH roots, collect(roots)+collect(firstDegree)+collect(secondDegree) AS nodes,
  collect(distinct r1)+collect(distinct r2) AS relationships
  UNWIND nodes as node
  UNWIND relationships as rel
  RETURN collect(distinct roots) as roots, collect(distinct node) as nodes, collect(distinct rel) as relationships
  `;
  return executeQueryWithParams(query, params).then(
    (result: StatementResult) => {
      return buildGraph(
        result.records[0].get("nodes"),
        result.records[0].get("relationships"),
        startUrn,
        result.records[0].get("roots")
      );
    }
  );
}
