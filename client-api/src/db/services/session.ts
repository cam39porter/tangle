import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { toSessionUrn } from "../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Session } from "../models/session";

export function get(userId: string, sessionId: string): Promise<Session> {
  const query = `
  MATCH (session:Session {id:{sessionId}})<-[:CREATED]-(u:User {id:{userId}})
  RETURN session`;
  const params = { userId, sessionId };
  return executeQuery(query, params).then((result: StatementResult) => {
    const session = result.records[0].get("session").properties as Session;
    if (!session.title) {
      session.title = getDefaultTitle();
    }
    return session;
  });
}

export function edit(
  userId: string,
  sessionId: string,
  title: string
): Promise<Session> {
  const query = `
    MATCH (session:Session {id:{sessionId}})<-[:CREATED]-(u:User {id:{userId}})
    ${title ? "SET session.title = {title}" : "REMOVE session.title"}
    RETURN session`;
  const params = { userId, sessionId, title };
  return executeQuery(query, params).then((result: StatementResult) => {
    const session = result.records[0].get("session").properties as Session;
    if (!session.title) {
      session.title = getDefaultTitle();
    }
    return session;
  });
}

export function create(userId: string, title: string): Promise<Session> {
  const uuid = uuidv4();
  const sessionUrn = toSessionUrn(uuid);
  const query = `
    MATCH (u:User {id:{userId}})
    CREATE (session:Session {id:{sessionUrn},
      ${title ? "title:{title}," : ""}
      created:TIMESTAMP(),
      owner:{userId}})
    CREATE (session)<-[:CREATED]-(u)
    RETURN session`;
  const params = { userId, sessionUrn, title };
  return executeQuery(query, params).then((result: StatementResult) => {
    const session = result.records[0].get("session").properties as Session;
    if (!session.title) {
      session.title = getDefaultTitle();
    }
    return session;
  });
}

function getDefaultTitle(): string {
  return "Untitled brainstorm";
}
