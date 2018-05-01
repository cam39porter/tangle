import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { escape } from "../../helpers/capture-parser";
import { toCaptureUrn } from "../../helpers/urn-helpers";
import { executeQueryWithParams } from "../db";
import { Capture } from "../models/capture";

export function archiveCaptureNode(
  userId: string,
  captureId: string
): Promise<Capture> {
  const params = { userId, captureId };
  const query = `MATCH (c:Capture {id:{captureId}})<-[:CREATED]-(u:User {id:{userId}})
  SET c.archived = true
  RETURN c
  `;
  return executeQueryWithParams(query, params).then(
    (result: StatementResult) => {
      return result.records[0].get("c").properties as Capture;
    }
  );
}

export function editCaptureNodeAndDeleteRelationships(
  userId: string,
  captureId: string,
  body: string
): Promise<Capture> {
  const params = { captureId, userId, body: escape(body) };
  const query = `
    MATCH (c:Capture {id:{captureId}})<-[:CREATED]-(u:User {id:{userId}})
    MATCH (c)-[r]-(other)
    WHERE type(r)<>"CREATED"
    DELETE r
    SET c.body={body}
    RETURN c`;
  return executeQueryWithParams(query, params).then(
    (result: StatementResult) => {
      return result.records[0].get("c").properties as Capture;
    }
  );
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
    CREATE (u)-[created:CREATED]->(n:Capture {
      id:{captureUrn},
      body:{body},
      created:TIMESTAMP()})
    ${parentId ? "CREATE (n)<-[:INCLUDES]-(parent)" : ""}
    RETURN n`;
  const params = { userId, body: escape(body), parentId, captureUrn };
  return executeQueryWithParams(query, params).then(
    (result: StatementResult) => {
      return result.records[0].get("n").properties as Capture;
    }
  );
}
