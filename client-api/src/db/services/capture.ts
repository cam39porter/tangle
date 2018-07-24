import { StatementResult, Node } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { escape } from "../../helpers/capture-parser";
import { executeQuery, Param } from "../db";
import { getLabel } from "../helpers/urn-helpers";
import { Capture } from "../models/capture";
import { CaptureUrn } from "../../urn/capture-urn";
import { UserUrn } from "../../urn/user-urn";
import { Urn } from "../../urn/urn";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { SessionUrn } from "../../urn/session-urn";
import {
  formatBasicCapture,
  formatCaptureWithSessions
} from "../formatters/capture";
import { NotFoundError } from "../../util/exceptions/not-found-error";
import { hydrate } from "../../helpers/array-helpers";

export function getMostRecent(
  userId: UserUrn,
  start: number,
  count: number
): Promise<Capture[]> {
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("start", start),
    new Param("count", count)
  ];
  const query = `MATCH (capture:Capture)<-[created:CREATED]-(user:User {id:{userId}})
  OPTIONAL MATCH (capture)<-[:INCLUDES]-(session:Session {owner:{userId}})
  RETURN capture, collect(session) as sessions
  ORDER BY capture.lastModified DESC
  SKIP {start} LIMIT {count}`;
  return executeQuery(query, params).then(result => {
    return result.records.map(record =>
      formatCaptureWithSessions(record.get("capture"), record.get("sessions"))
    );
  });
}

export function batchGetCaptures(
  loggedInUser: UserUrn,
  userUrns: UserUrn[],
  captureUrns: CaptureUrn[]
): Promise<Capture[]> {
  const params = [
    new Param("userUrns", userUrns.map(urn => urn.toRaw())),
    new Param("captureUrns", captureUrns.map(urn => urn.toRaw()))
  ];
  const query = `MATCH (capture:Capture)<-[:CREATED]-(author:User)
  WHERE capture.id IN {captureUrns} AND capture.owner IN {userUrns}
  OPTIONAL MATCH (capture)<-[:INCLUDES]-(session:Session)
  WHERE session.owner IN {userUrns}
  RETURN capture, author, collect(session) as sessions`;
  return executeQuery(query, params).then(result => {
    const captures = result.records.map(record => {
      const author = record.get("author");
      const someoneElsesName =
        author && author.properties["id"] !== loggedInUser.toRaw()
          ? author.properties["name"]
          : null;
      return formatCaptureWithSessions(
        record.get("capture"),
        record.get("sessions"),
        someoneElsesName
      );
    });
    return hydrate(captureUrns, captures, capture => capture.urn);
  });
}

export function getCapture(
  userId: UserUrn,
  captureUrn: CaptureUrn
): Promise<Capture> {
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("captureUrn", captureUrn.toRaw())
  ];
  const query = `
    MATCH (capture:Capture {id:{captureUrn}})<-[created:CREATED]-(user:User {id:{userId}})
    RETURN capture
  `;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function getUntypedNode(userId: UserUrn, nodeUrn: Urn): Promise<Node> {
  const label = getLabel(nodeUrn);
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("nodeId", nodeUrn.toRaw())
  ];
  const query = `MATCH (n:${label} {id:{nodeId}, owner:{userId}})
  RETURN n
  `;
  return executeQuery(query, params).then(result => {
    return result.records[0].get("n") as Node;
  });
}

export function getCapturesByRelatedNode(
  userId: UserUrn,
  nodeId: Urn
): Promise<Capture[]> {
  const label = getLabel(nodeId);
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("nodeId", nodeId.toRaw())
  ];
  const query = `MATCH (other:${label} {id:{nodeId}})-[r]-(capture:Capture)<-[:CREATED]-(u:User {id:{userId}})
  RETURN capture
  `;
  return executeQuery(query, params).then(result => {
    return formatCaptureArray(result);
  });
}

export function deleteCaptureNode(
  userId: UserUrn,
  captureUrn: CaptureUrn
): Promise<boolean> {
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("captureUrn", captureUrn.toRaw())
  ];
  const query = `MATCH (capture:Capture {id:{captureUrn}})<-[:CREATED]-(u:User {id:{userId}})
  DETACH DELETE capture
  `;
  return executeQuery(query, params).then(() => true);
}

export function editCaptureNodeAndDeleteRelationships(
  userId: UserUrn,
  captureUrn: CaptureUrn,
  plainText: string,
  html: string
): Promise<Capture> {
  const params = [
    new Param("captureUrn", captureUrn.toRaw()),
    new Param("userId", userId.toRaw()),
    new Param("plainText", escape(plainText)),
    new Param("html", escape(html))
  ];
  const query = `
    MATCH (capture:Capture {id:{captureUrn}})<-[:CREATED]-(u:User {id:{userId}})
    OPTIONAL MATCH (capture)-[r]-(other)
    WHERE type(r)<>"CREATED" AND type(r)<>"INCLUDES"
    DELETE r
    SET capture.plainText={plainText}
    SET capture.body={html}
    SET capture.lastModified=TIMESTAMP()
    RETURN capture`;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function createCaptureNode(
  userId: UserUrn,
  plainText: string,
  html: string,
  parentUrn: EvernoteNoteUrn | SessionUrn | null,
  previouslyCreated: number | null
): Promise<Capture> {
  const uuid = uuidv4();
  const captureUrn = new CaptureUrn(uuid);
  const now = Date.now();
  const created = previouslyCreated || now;
  const parentQuery = parentUrn
    ? `OPTIONAL MATCH (u)-[:CREATED]-(parent {id:{parentId}}) WHERE parent:Session OR parent:EvernoteNote`
    : ``;
  const query = `MATCH (u:User {id:{userId}})
    ${parentQuery}
    CREATE (u)-[created:CREATED]->(capture:Capture {
      id:{captureUrn},
      body:{html},
      plainText:{plainText},
      created:{created},
      lastModified:{now},
      owner:{userId}
    })
    ${parentUrn ? "CREATE (capture)<-[:INCLUDES]-(parent)" : ""}
    RETURN capture`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("plainText", escape(plainText)),
    new Param("html", escape(html)),
    new Param("parentId", parentUrn ? parentUrn.toRaw() : null),
    new Param("captureUrn", captureUrn.toRaw()),
    new Param("now", now),
    new Param("created", created)
  ];
  return executeQuery(query, params).then(formatCaptureResult);
}

// TODO RM all these as use formatter
function formatCaptureArray(result: StatementResult): Capture[] {
  return result.records.map(record =>
    formatBasicCapture(record.get("capture"))
  );
}

function formatCaptureResult(result: StatementResult): Capture {
  if (!result.records[0]) {
    throw new NotFoundError("Could not find capture");
  }
  return formatBasicCapture(result.records[0].get("capture"));
}
