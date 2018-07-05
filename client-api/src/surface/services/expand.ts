import { StatementResult, Node, Relationship } from "neo4j-driver/types/v1";
import { executeQuery, Param } from "../../db/db";
import { buildGraph } from "../formatters/graph";
import { Graph } from "../models/graph";
import { Capture } from "../../db/models/capture";
import { ListItem } from "../models/list-item";
import { buildList } from "../formatters/list";
import { SurfaceResults } from "../models/surface-results";
import { PageInfo } from "../models/page-info";
import { GraphNode } from "../models/graph-node";
import { CaptureUrn } from "../../urn/capture-urn";
import { formatBasicCapture } from "../../db/formatters/capture";
import { UserUrn } from "../../urn/user-urn";
import { SessionUrn } from "../../urn/session-urn";
import { PagingContext } from "../models/paging-context";
import { getAuthenticatedUser } from "../../filters/request-context";
import { formatCaptureWithSessions } from "../../db/formatters/capture";
import { CollectionResult } from "../models/collection-result";
import { transformFromCountPlusOne } from "../../helpers/page";

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
  const params = [
    new Param("userUrn", userUrn.toRaw()),
    new Param("captureIds", captureUrns.map(urn => urn.toRaw())),
    new Param("startUrn", startUrn)
  ];
  const query = getExpansionQuery(startUrn, false);
  return executeQuery(query, params).then((result: StatementResult) => {
    return buildGraph(formatDbResponse(result));
  });
}

export function getRelatedCapturesBySession(
  sessionUrn: SessionUrn,
  pagingContext: PagingContext
): Promise<CollectionResult<Capture>> {
  const userUrn = getAuthenticatedUser().urn;
  const query = `
  MATCH (rootSession:Session {id:{sessionUrn}, owner:{userUrn}})-[:INCLUDES]-
  (firstCaptures:Capture {owner:{userUrn}})-[r1:TAGGED_WITH|REFERENCES]->
  (firstDegree)<-[r2:TAGGED_WITH|REFERENCES]-
  (secondDegree:Capture {owner:{userUrn}})
  WHERE (firstDegree:Tag OR firstDegree:Entity)
  WITH r1, r2, secondDegree as capture
  OPTIONAL MATCH (capture)<-[:INCLUDES]-(session:Session {owner:{userUrn}})
  WITH r1, r2, capture, collect(session) as sessions
  ORDER BY r1.salience * r2.salience
  WITH DISTINCT capture as capture, sessions
  SKIP {start} LIMIT {count}
  RETURN capture, sessions
  `;
  const params = [
    new Param("userUrn", userUrn.toRaw()),
    new Param("sessionUrn", sessionUrn.toRaw()),
    new Param("start", parseFloat(pagingContext.pageId)),
    new Param("count", pagingContext.count + 1)
  ];
  return executeQuery(query, params).then(result => {
    const captures: Capture[] = result.records.map(record => {
      return formatCaptureWithSessions(
        record.get("capture"),
        record.get("sessions")
      );
    });
    const end = parseFloat(pagingContext.pageId) + pagingContext.count;
    return transformFromCountPlusOne(captures, pagingContext, end.toString());
  });
}
function expandList(
  userUrn: UserUrn,
  captureUrns: CaptureUrn[],
  startUrn: string = null
): Promise<ListItem[]> {
  const params = [
    new Param("userUrn", userUrn.toRaw()),
    new Param("captureIds", captureUrns.map(urn => urn.toRaw())),
    new Param("startUrn", startUrn)
  ];
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
      ? formatBasicCapture(record.get("roots"))
      : (null as Capture);
    const r1: Relationship = record.get("r1") as Relationship;
    const intermediate: Node = record.get("firstDegree") as Node;
    const r2: Relationship = record.get("r2") as Relationship;
    const end: Capture = record.get("secondDegree")
      ? formatBasicCapture(record.get("secondDegree"))
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
  ${startUrn ? "AND (firstDegree.id <> startUrn)" : ""}
  RETURN r1, firstDegree
  ORDER BY r1.salience DESC LIMIT 5',
  {roots:roots, startUrn:{startUrn}}) YIELD value
  WITH roots, value.r1 as r1, value.firstDegree as firstDegree, collect(roots) as allRoots

  CALL apoc.cypher.run('
  OPTIONAL MATCH (firstDegree)-[r2:TAGGED_WITH|REFERENCES|LINKS_TO]-
  (secondDegree:Capture)<-[:CREATED]-(u:User {id:{userUrn}})
  RETURN firstDegree, r2, secondDegree
  ORDER BY r2.salience DESC LIMIT 5',
  {firstDegree:firstDegree, userUrn:{userUrn}}) YIELD value
  WITH roots, r1, value.firstDegree as firstDegree, value.r2 as r2, value.secondDegree as secondDegree
  RETURN roots, r1, firstDegree, r2, secondDegree
  `;
}
