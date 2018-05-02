import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { escape } from "../../helpers/capture-parser";
import { toCaptureUrn } from "../../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Capture } from "../models/capture";

export function getAllSince(userId: string, since: number): Promise<Capture[]> {
  const params = { userId, since };
  const query = `MATCH (capture:Capture)<-[created:CREATED]-(user:User {id:{userId}})
  WHERE capture.created > {since} AND NOT EXISTS (capture.archived)
  RETURN capture
  ORDER BY capture.created DESC
  LIMIT 50`;
  return executeQuery(query, params).then(formatCaptureArray);
}

export function getCapture(
  userId: string,
  captureId: string
): Promise<Capture> {
  const params = { userId, captureId };
  const query = `
    MATCH (capture:Capture {id:{captureId}})<-[created:CREATED]-(user:User {id:{userId}})
    RETURN capture
  `;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function getCapturesByRelatedNode(
  userId: string,
  nodeId: string
): Promise<Capture[]> {
  const params = { userId, nodeId };
  const query = `MATCH (other {id:{nodeId}})-[r]-(capture:Capture)<-[:CREATED]-(u:User {id:{userId}})
  WHERE NOT EXISTS(capture.archived) OR capture.archived = false
  RETURN capture
  `;
  return executeQuery(query, params).then(formatCaptureArray);
}

export function getRandomCapture(userId: string): Promise<Capture> {
  const params = { userId };
  const query = `MATCH (capture:Capture)<-[created:CREATED]-(user:User {id:{userId}})
  WHERE NOT EXISTS (capture.archived) OR capture.archived = false
  RETURN capture, rand() as number
  ORDER BY number
  LIMIT 1`;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function archiveCaptureNode(
  userId: string,
  captureId: string
): Promise<Capture> {
  const params = { userId, captureId };
  const query = `MATCH (capture:Capture {id:{captureId}})<-[:CREATED]-(u:User {id:{userId}})
  SET capture.archived = true
  RETURN capture
  `;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function editCaptureNodeAndDeleteRelationships(
  userId: string,
  captureId: string,
  body: string
): Promise<Capture> {
  const params = { captureId, userId, body: escape(body) };
  const query = `
    MATCH (capture:Capture {id:{captureId}})<-[:CREATED]-(u:User {id:{userId}})
    MATCH (capture)-[r]-(other)
    WHERE type(r)<>"CREATED"
    DELETE r
    SET capture.body={body}
    RETURN capture`;
  return executeQuery(query, params).then(formatCaptureResult);
}

export function createCaptureNode(
  userId: string,
  body: string,
  parentId: string
): Promise<Capture> {
  const uuid = uuidv4();
  const captureUrn = toCaptureUrn(uuid);
  const parentQuery = parentId
    ? `OPTIONAL MATCH (u)-[:CREATED]-(parent {id:{parentId}}) WHERE parent:Session OR parent:EvernoteNote`
    : ``;
  const query = `MATCH (u:User {id:{userId}})
    ${parentQuery}
    CREATE (u)-[created:CREATED]->(capture:Capture {
      id:{captureUrn},
      body:{body},
      created:TIMESTAMP()})
    ${parentId ? "CREATE (capture)<-[:INCLUDES]-(parent)" : ""}
    RETURN capture`;
  const params = { userId, body: escape(body), parentId, captureUrn };
  return executeQuery(query, params).then(formatCaptureResult);
}

function formatCaptureArray(result: StatementResult): Capture[] {
  return result.records.map(formatCaptureRecord);
}

function formatCaptureResult(result: StatementResult): Capture {
  return formatCaptureRecord(result.records[0]);
}

function formatCaptureRecord(record: any): Capture {
  return record.get("capture").properties as Capture;
}
