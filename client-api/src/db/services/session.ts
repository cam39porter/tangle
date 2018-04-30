import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { toSessionUrn } from "../../helpers/urn-helpers";
import { GraphNode } from "../../models/graph-node";
import { executeQuery } from "../db";

export function createSession(
  userId: string,
  title: string
): Promise<GraphNode> {
  const uuid = uuidv4();
  const sessionUrn = toSessionUrn(uuid);
  return executeQuery(`
  MATCH (u:User {id:"${userId}"})
  CREATE (session:Session {id:"${sessionUrn}", title:"${title}", created:TIMESTAMP()})
  CREATE (session)<-[:CREATED]-(u)
  RETURN session`).then((result: StatementResult) => {
    const record = result.records[0].get("session");
    return new GraphNode(
      record.properties.id,
      "Session",
      record.properties.title,
      null
    );
  });
}
