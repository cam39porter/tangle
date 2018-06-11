import { StatementResult, Node, Relationship } from "neo4j-driver/types/v1";
import { executeQuery } from "../../db/db";
import { buildGraph } from "../formatters/graph";
import { Graph } from "../models/graph";
import { Capture } from "../../db/models/capture";
import { ListItem } from "../models/list-item";
import { buildList } from "../formatters/list";
import { SurfaceResults } from "../models/surface-results";
import { PageInfo } from "../models/page-info";
import { GraphNode } from "../models/graph-node";
import { CaptureUrn } from "../../urn/capture-urn";
import { buildFromNeo } from "../../db/services/capture";
import { UserUrn } from "../../urn/user-urn";

export function expandCaptures(
  userUrn: UserUrn,
  captureUrns: CaptureUrn[],
  pivot: GraphNode = null
): Promise<SurfaceResults> {
  const expansionPromises = Promise.all([
    expandGraph(userUrn, captureUrns, (pivot && pivot.id) || null),
    expandList(userUrn, captureUrns)
  ]);
  return expansionPromises.then(expansions => {
    const graph = expansions[0];
    const list = expansions[1];
    return new SurfaceResults(
      graph,
      list,
      new PageInfo(0, graph.nodes.length, graph.nodes.length),
      pivot
    );
  });
}

function expandGraph(
  userUrn: UserUrn,
  captureUrns: CaptureUrn[],
  startUrn: string = null
): Promise<Graph> {
  const params = {
    userUrn: userUrn.toRaw(),
    captureIds: captureUrns.map(urn => urn.toRaw()),
    startUrn
  };
  const query = getExpansionQuery(startUrn, false);
  return executeQuery(query, params).then((result: StatementResult) => {
    return buildGraph(formatDbResponse(result));
  });
}

function expandList(
  userUrn: UserUrn,
  captureUrns: CaptureUrn[],
  startUrn: string = null
): Promise<ListItem[]> {
  const params = {
    userUrn: userUrn.toRaw(),
    captureIds: captureUrns.map(urn => urn.toRaw()),
    startUrn
  };
  const query = getExpansionQuery(startUrn, true);
  return executeQuery(query, params).then((result: StatementResult) => {
    return buildList(formatDbResponse(result), captureUrns);
  });
}

function formatDbResponse(
  result: StatementResult
): Array<[Capture, Relationship, Node, Relationship, Capture]> {
  const paths: Array<
    [Capture, Relationship, Node, Relationship, Capture]
  > = result.records.map(record => {
    const root: Capture = record.get("roots")
      ? buildFromNeo(record.get("roots").properties)
      : (null as Capture);
    const r1: Relationship = record.get("r1") as Relationship;
    const intermediate: Node = record.get("firstDegree") as Node;
    const r2: Relationship = record.get("r2") as Relationship;
    const end: Capture = record.get("secondDegree")
      ? buildFromNeo(record.get("secondDegree").properties)
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

  CALL apoc.cypher.run('
  OPTIONAL MATCH (firstDegree)-[r2:TAGGED_WITH|REFERENCES|LINKS_TO]-
  (secondDegree:Capture)<-[:CREATED]-(u:User {id:{userUrn}})
  WHERE (NOT EXISTS(secondDegree.archived) or secondDegree.archived = false)
  RETURN firstDegree, r2, secondDegree
  ORDER BY r2.salience DESC LIMIT 5',
  {firstDegree:firstDegree, userUrn:{userUrn}}) YIELD value
  WITH roots, r1, value.firstDegree as firstDegree, value.r2 as r2, value.secondDegree as secondDegree
  RETURN roots, r1, firstDegree, r2, secondDegree
  `;
}
