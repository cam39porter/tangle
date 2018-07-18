import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery, Param } from "../db";
import { Session } from "../models/session";
import { NotFoundError } from "../../util/exceptions/not-found-error";
import { SessionUrn } from "../../urn/session-urn";
import { UserUrn } from "../../urn/user-urn";
import { PagingContext } from "../../surface/models/paging-context";
import {
  formatBasicSession,
  formatSessionWithCaptures
} from "../formatters/session";
import { hydrate } from "../../helpers/array-helpers";

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
  ORDER BY session.lastModified DESC
  LIMIT {count}`;
  const params = [
    new Param("userUrn", user.toRaw()),
    new Param("before", before),
    new Param("count", count)
  ];
  return executeQuery(query, params).then(result => {
    return result.records.map(record =>
      formatBasicSession(record.get("session"))
    );
  });
}

export function batchGetSessions(
  userId: UserUrn,
  sessionUrns: SessionUrn[]
): Promise<Session[]> {
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionUrns", sessionUrns.map(urn => urn.toRaw()))
  ];
  const query = `MATCH (session:Session {owner:{userId}})
  WHERE session.id IN {sessionUrns}
  RETURN session`;
  return executeQuery(query, params).then(result => {
    const sessions = result.records.map(record =>
      formatBasicSession(record.get("session"))
    );
    return hydrate(sessionUrns, sessions, session => session.urn);
  });
}

export function getBasic(
  userId: UserUrn,
  sessionId: SessionUrn
): Promise<Session> {
  const query = `
  MATCH (session:Session {id:{sessionId}, owner:{userId}})
  RETURN session
  `;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionId", sessionId.toRaw())
  ];
  return executeQuery(query, params).then(result => {
    if (!result.records[0]) {
      throw new NotFoundError(
        `Session with id ${sessionId.toRaw()} could not be found.`
      );
    }
    const row = result.records[0];
    return formatBasicSession(row.get("session"));
  });
}

export function get(
  userId: UserUrn,
  sessionId: SessionUrn,
  itemsPagingContext: PagingContext
): Promise<Session> {
  const query = `
  MATCH (session:Session {id:{sessionId}, owner:{userId}})
  WITH session
  OPTIONAL MATCH (session)-[:INCLUDES]->(capture:Capture {owner:{userId}})
  WITH session, capture ORDER BY capture.created
  RETURN session, collect(capture)[{start}..{start}+{count}] as captures, COUNT(capture) AS totalCaptures
  `;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionId", sessionId.toRaw()),
    new Param(
      "start",
      itemsPagingContext.pageId ? parseInt(itemsPagingContext.pageId, 10) : 0
    ),
    new Param("count", itemsPagingContext.count + 1)
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    if (!result.records[0]) {
      throw new NotFoundError(
        `Session with id ${sessionId.toRaw()} could not be found.`
      );
    }
    const row = result.records[0];
    return formatSessionWithCaptures(
      row.get("session"),
      row.get("captures"),
      row.get("totalCaptures"),
      itemsPagingContext
    );
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

export function touchLastModified(
  userUrn: UserUrn,
  sessionId: SessionUrn
): Promise<Session> {
  const query = `
  MATCH (session:Session {id:{sessionId}})<-[:CREATED]-(u:User {id:{userId}})
  SET session.lastModified = TIMESTAMP()
  RETURN session`;
  const params = [
    new Param("userId", userUrn.toRaw()),
    new Param("sessionId", sessionId.toRaw())
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    if (!result.records[0]) {
      throw new NotFoundError(
        `Session with id ${sessionId.toRaw()} could not be found.`
      );
    }
    return formatBasicSession(result.records[0].get("session"));
  });
}

export function edit(
  userId: UserUrn,
  sessionId: SessionUrn,
  title: string,
  body: string
): Promise<Session> {
  const query = `
    MATCH (session:Session {id:{sessionId}})<-[:CREATED]-(u:User {id:{userId}})
    SET session.lastModified = TIMESTAMP()
    ${title ? "SET session.title = {title}" : "REMOVE session.title"}
    ${body ? "SET session.body = {body}" : ""}
    RETURN session`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionId", sessionId.toRaw()),
    new Param("title", title),
    new Param("body", body)
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    if (!result.records[0]) {
      throw new NotFoundError(
        `Session with id ${sessionId.toRaw()} could not be found.`
      );
    }
    return formatBasicSession(result.records[0].get("session"));
  });
}

export function create(
  sessionUrn: SessionUrn,
  userId: UserUrn,
  title: string,
  body: string,
  previouslyCreated: number | null,
  imported?: boolean
): Promise<Session> {
  const now = Date.now();
  const created = previouslyCreated || now;
  const query = `
    MATCH (u:User {id:{userId}})
    CREATE (session:Session {id:{sessionUrn},
      ${title ? "title:{title}," : ""}
      ${body ? "body:{body}," : ""}
      ${imported ? "imported:{imported}," : ""}
      created:{created},
      lastModified:{now},
      owner:{userId}})
    CREATE (session)<-[:CREATED]-(u)
    RETURN session`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("sessionUrn", sessionUrn.toRaw()),
    new Param("title", title),
    new Param("body", body),
    new Param("created", created),
    new Param("now", now),
    new Param("imported", imported && imported.toString())
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    if (!result.records[0]) {
      throw new NotFoundError(
        `Session with id ${sessionUrn.toRaw()} could not be found.`
      );
    }
    return formatBasicSession(result.records[0].get("session"));
  });
}
