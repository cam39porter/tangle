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
  WHERE NOT EXISTS (capture.archived)
  OPTIONAL MATCH (capture)<-[:INCLUDES]-(session:Session {owner:{userId}})
  RETURN capture, collect(session) as sessions
  ORDER BY capture.created DESC
  SKIP {start} LIMIT {count}`;
  return executeQuery(query, params).then(result => {
    return result.records.map(record =>
      formatCaptureWithSessions(record.get("capture"), record.get("sessions"))
    );
  });
}

export function batchGetCaptures(
  userId: UserUrn,
  captures: CaptureUrn[]
): Promise<Capture[]> {
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("captureUrns", captures.map(urn => urn.toRaw()))
  ];
  const query = `MATCH (capture:Capture {owner:{userId}})
  WHERE capture.id IN {captureUrns}
  OPTIONAL MATCH (capture)<-[:INCLUDES]-(session:Session {owner:{userId}})
  RETURN capture, collect(session) as sessions`;
  return executeQuery(query, params).then(result => {
    return result.records.map(record =>
      formatCaptureWithSessions(record.get("capture"), record.get("sessions"))
    );
  });
}

export function getAllSince(
  userId: UserUrn,
  since: number
): Promise<Capture[]> {
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("since", since)
  ];
  const query = `MATCH (capture:Capture)<-[created:CREATED]-(user:User {id:{userId}})
  WHERE capture.created > {since} AND NOT EXISTS (capture.archived)
  RETURN capture
  ORDER BY capture.created DESC
  LIMIT 50`;
  return executeQuery(query, params).then(formatCaptureArray);
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
    WHERE NOT EXISTS(capture.archived) OR capture.archived = false
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
  WHERE NOT EXISTS(n.archived) OR n.archived = false
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
  WHERE NOT EXISTS(capture.archived) OR capture.archived = false
  RETURN capture
  `;
  return executeQuery(query, params).then(result => {
    return formatCaptureArray(result);
  });
}

export function getRandomCapture(userId: UserUrn): Promise<Capture> {
  const params = [new Param("userId", userId.toRaw())];
  const query = `MATCH (capture:Capture)<-[created:CREATED]-(user:User {id:{userId}})
  WHERE NOT EXISTS (capture.archived) OR capture.archived = false
  RETURN capture, rand() as number
  ORDER BY number
  LIMIT 1`;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function archiveCaptureNode(
  userId: UserUrn,
  captureUrn: CaptureUrn
): Promise<Capture> {
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("captureUrn", captureUrn.toRaw())
  ];
  const query = `MATCH (capture:Capture {id:{captureUrn}})<-[:CREATED]-(u:User {id:{userId}})
  SET capture.archived = true
  RETURN capture
  `;
  return executeQuery(query, params).then(formatCaptureResult);
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
    RETURN capture`;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function createCaptureNode(
  userId: UserUrn,
  plainText: string,
  html: string,
  parentUrn: EvernoteNoteUrn | SessionUrn | null
): Promise<Capture> {
  const uuid = uuidv4();
  const captureUrn = new CaptureUrn(uuid);
  const parentQuery = parentUrn
    ? `OPTIONAL MATCH (u)-[:CREATED]-(parent {id:{parentId}}) WHERE parent:Session OR parent:EvernoteNote`
    : ``;
  const query = `MATCH (u:User {id:{userId}})
    ${parentQuery}
    CREATE (u)-[created:CREATED]->(capture:Capture {
      id:{captureUrn},
      body:{html},
      plainText:{plainText},
      created:TIMESTAMP(),
      owner:{userId}
    })
    ${parentUrn ? "CREATE (capture)<-[:INCLUDES]-(parent)" : ""}
    RETURN capture`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("plainText", escape(plainText)),
    new Param("html", escape(html)),
    new Param("parentId", parentUrn ? parentUrn.toRaw() : null),
    new Param("captureUrn", captureUrn.toRaw())
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
