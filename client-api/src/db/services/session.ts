import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { executeQuery, Param } from "../db";
import { Session } from "../models/session";
import { NotFoundError } from "../../util/exceptions/not-found-error";
import { SessionUrn } from "../../urn/session-urn";
import { UserUrn } from "../../urn/user-urn";
import { PagingContext } from "../../surface/models/paging-context";
import { buildFromNeo } from "./capture";
import { CollectionResult } from "../../surface/models/collection-result";
import { PagingInfo } from "../../surface/models/paging-info";

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
  LIMIT {count}`;
  const params = [
    new Param("userUrn", user.toRaw()),
    new Param("before", before),
    new Param("count", count)
  ];
  return executeQuery(query, params).then(result => {
    return result.records.map(record => formatSessionRecord(record));
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
  MATCH (session)-[:INCLUDES]->(capture:Capture {owner:{userId}})
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
    new Param("count", itemsPagingContext.count)
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    return formatSessionRecord(result.records[0], itemsPagingContext);
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

function formatSessionRecord(
  record: any,
  itemsPagingContext?: PagingContext
): Session {
  if (!record) {
    throw new NotFoundError("Could not find record");
  }
  const session = Session.fromProperties(record.get("session").properties);
  if (record.has("captures")) {
    const captures = record
      .get("captures")
      .map(capture => buildFromNeo(capture.properties));
    const start = itemsPagingContext.pageId
      ? parseInt(itemsPagingContext.pageId, 10)
      : 0;
    session.itemCollection = new CollectionResult(
      captures,
      new PagingInfo(
        (start + itemsPagingContext.count).toString(),
        record.get("totalCaptures")
      )
    );
  }
  return session;
}
