import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { executeQuery, Param } from "../db";
import { Session } from "../models/session";
import { NotFoundError } from "../../util/exceptions/not-found-error";
import { SessionUrn } from "../../urn/session-urn";
import { UserUrn } from "../../urn/user-urn";

export function getMostRecent(
  user: UserUrn,
  before: number | null,
  count: number
): Promise<Session[]> {
  const query = `
  MATCH (session:Session)
  WHERE session.owner = {userUrn}
  ${before ? "AND session.created <= {before}" : ""}
  RETURN session
  ORDER BY session.created DESC
  LIMIT {count} `;
  const params = [
    new Param("userUrn", user.toRaw()),
    new Param("before", before),
    new Param("count", count)
  ];
  return executeQuery(query, params).then(result => {
    return result.records.map(record => formatSessionRecord(record));
  });
}

export function get(userId: UserUrn, sessionId: SessionUrn): Promise<Session> {
  const query = `
  MATCH (session:Session {id:{sessionId}})<-[:CREATED]-(u:User {id:{userId}})
  RETURN session`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionId", sessionId.toRaw())
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    return formatSessionRecord(result.records[0]);
  });
}

export function deleteSession(
  userId: UserUrn,
  sessionId: SessionUrn
): Promise<boolean> {
  const query = `
  MATCH (s:Session {id:{sessionId}})<-[:CREATED]-(u:User {id:{userId}})
  DETACH DELETE s
  `;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionId", sessionId.toRaw())
  ];
  return executeQuery(query, params).then(() => true);
}

export function edit(
  userId: UserUrn,
  sessionId: SessionUrn,
  title: string
): Promise<Session> {
  const query = `
    MATCH (session:Session {id:{sessionId}})<-[:CREATED]-(u:User {id:{userId}})
    ${title ? "SET session.title = {title}" : "REMOVE session.title"}
    RETURN session`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionId", sessionId.toRaw()),
    new Param("title", title)
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    return formatSessionRecord(result.records[0]);
  });
}

export function create(userId: UserUrn, title: string): Promise<Session> {
  const uuid = uuidv4();
  const sessionUrn = new SessionUrn(uuid);
  const query = `
    MATCH (u:User {id:{userId}})
    CREATE (session:Session {id:{sessionUrn},
      ${title ? "title:{title}," : ""}
      created:TIMESTAMP(),
      owner:{userId}})
    CREATE (session)<-[:CREATED]-(u)
    RETURN session`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionUrn", sessionUrn.toRaw()),
    new Param("title", title)
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    return formatSessionRecord(result.records[0]);
  });
}

function formatSessionRecord(record: any): Session {
  if (!record) {
    throw new NotFoundError("Could not find record");
  }
  return Session.fromProperties(record.get("session").properties);
}
