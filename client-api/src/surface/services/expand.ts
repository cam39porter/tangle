import { StatementResult, Node, Relationship } from "neo4j-driver/types/v1";
import { executeQuery, Param } from "../../db/db";
import { buildGraph } from "../formatters/graph";
import { Graph } from "../models/graph";
import { Capture } from "../../db/models/capture";
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
import { formatBasicSession } from "../../db/formatters/session";
import { Session } from "../../db/models/session";

export function expandCaptures(
  userUrn: UserUrn,
  captureUrns: CaptureUrn[],
  pivot: GraphNode = null
): Promise<SurfaceResults> {
  return expandGraph(userUrn, captureUrns, (pivot && pivot.id) || null).then(
    graph => {
      return new SurfaceResults(
        graph,
        null,
        new PageInfo(0, graph.nodes.length, graph.nodes.length),
        pivot
      );
    }
  );
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

  const query = getExpansionQuery(startUrn);
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
    const captures: Capture[] = result.records
      .filter(record => {
        const sessions: Session[] = record
          .get("sessions")
          .map(formatBasicSession);
        const sessionUrns: string[] = sessions.map(session =>
          session.urn.toRaw()
        );
        return !sessionUrns.includes(sessionUrn.toRaw());
      })
      .map(record => {
        return formatCaptureWithSessions(
          record.get("capture"),
          record.get("sessions")
        );
      });
    const end = parseFloat(pagingContext.pageId) + pagingContext.count;
    return transformFromCountPlusOne(captures, pagingContext, end.toString());
  });
}

function formatDbResponse(
  result: StatementResult
): Array<
  [Capture, Session[], Relationship, Node, Relationship, Capture, Session[]]
> {
  const paths: Array<
    [Capture, Session[], Relationship, Node, Relationship, Capture, Session[]]
  > = result.records.map(record => {
    const root: Capture = record.get("roots")
      ? formatBasicCapture(record.get("roots"))
      : (null as Capture);
    const rootParents: Session[] = record
      .get("rootParents")
      .map(session => formatBasicSession(session));
    const r1: Relationship = record.get("r1") as Relationship;
    const intermediate: Node = record.get("firstDegree") as Node;
    const r2: Relationship = record.get("r2") as Relationship;
    const end: Capture = record.get("secondDegree")
      ? formatBasicCapture(record.get("secondDegree"))
      : (null as Capture);
    const secondDegreeParents: Session[] = record
      .get("secondDegreeParents")
      .map(session => formatBasicSession(session));
    const ret: [
      Capture,
      Session[],
      Relationship,
      Node,
      Relationship,
      Capture,
      Session[]
    ] = [root, rootParents, r1, intermediate, r2, end, secondDegreeParents];
    return ret;
  });
  return paths;
}

function getExpansionQuery(startUrn: string): string {
  return `
  MATCH (roots:Capture)
  WHERE roots.id IN {captureIds} AND roots.owner = {userUrn}
  WITH roots
  OPTIONAL MATCH (roots)<-[:INCLUDES]-(rootParent:Session)
  WITH roots, collect(rootParent) as rootParents

  CALL apoc.cypher.run('
  OPTIONAL MATCH (roots)-[r1:TAGGED_WITH|REFERENCES]-(firstDegree)
  WHERE (firstDegree:Tag OR firstDegree:Entity)
  AND firstDegree.owner = {userUrn}
  ${startUrn ? "AND (firstDegree.id <> startUrn)" : ""}
  RETURN r1, firstDegree
  ORDER BY r1.salience DESC LIMIT 5',
  {roots:roots, startUrn:{startUrn}, userUrn:{userUrn}}) YIELD value
  WITH roots, rootParents, value.r1 as r1, value.firstDegree as firstDegree, collect(roots) as allRoots

  CALL apoc.cypher.run('
  OPTIONAL MATCH (firstDegree)-[r2:TAGGED_WITH|REFERENCES]-
  (secondDegree:Capture)
  WHERE secondDegree.owner = {userUrn}
  WITH firstDegree, r2, secondDegree
  ORDER BY r2.salience DESC LIMIT 5
  OPTIONAL MATCH (secondDegree)<-[:INCLUDES]-(secondDegreeParent:Session)
  RETURN firstDegree, r2, secondDegree, collect(secondDegreeParent) as secondDegreeParents',
  {firstDegree:firstDegree, userUrn:{userUrn}}) YIELD value
  WITH roots, rootParents, r1, value.firstDegree as firstDegree,
    value.r2 as r2, value.secondDegree as secondDegree, value.secondDegreeParents as secondDegreeParents
  RETURN roots, rootParents, r1, firstDegree, r2, secondDegree, secondDegreeParents
  `;
}
