import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { toSessionUrn } from "../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Session } from "../models/session";

export function create(userId: string, title: string): Promise<Session> {
  const uuid = uuidv4();
  const sessionUrn = toSessionUrn(uuid);
  const query = `
    MATCH (u:User {id:{userId}})
    CREATE (session:Session {id:{sessionUrn},
      ${title ? "title:{title}," : ""}
      created:TIMESTAMP()})
    CREATE (session)<-[:CREATED]-(u)
    RETURN session`;
  const params = { userId, sessionUrn, title };
  return executeQuery(query, params).then((result: StatementResult) => {
    const session = result.records[0].get("session").properties as Session;
    if (!session.title) {
      session.title = "Untitled brainstorm";
    }
    return session;
  });
}
