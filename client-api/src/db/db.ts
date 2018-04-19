import { GraphNode, User, NLPEntity } from "../models";
import { v1 as neo4j } from "neo4j-driver";
import { v4 as uuidv4 } from "uuid/v4";
import { StatementResult } from "neo4j-driver/types/v1";

import {
  toCaptureUrn,
  toTagUrn,
  toUserUrn,
  toEntityUrn,
  toSessionUrn
} from "../helpers/urn-helpers";

const driver = neo4j.driver(
  "bolt://35.197.102.210:7687",
  neo4j.auth.basic("neo4j", "Z868sybiq7cGzFeA")
);
const session = driver.session();

function createSession(userId: string, title: string): Promise<GraphNode> {
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

function getUser(urn: string): Promise<User> {
  return executeQuery(`
  MATCH (u:User {id:"${urn}"})
  RETURN u`).then((result: StatementResult) => {
    return result.records[0].get("u").properties as User;
  });
}

function archiveCaptureNode(id: string, captureId: string): Promise<void> {
  return executeQuery(
    `MATCH (c:Capture {id:"${captureId}"})<-[:CREATED]-(u:User {id:"${id}"})
    SET c.archived = true
    `
  ).then(result => null);
}

function editCaptureNode(
  userId: string,
  captureId: string,
  body: string
): Promise<boolean> {
  return executeQuery(`
  MATCH (n:Capture {id:"${captureId}"})<-[:CREATED]-(u:User {id:"${userId}"})
  MATCH (n)-[r]-(other)
  WHERE type(r)<>"CREATED"
  DELETE r
  SET n.body="${escape(body)}"
  RETURN n`).then((result: StatementResult) => {
    return true;
  });
}

function createCaptureNode(
  user: User,
  body: string,
  sessionId: string
): Promise<GraphNode> {
  const uuid = uuidv4();
  const captureUrn = toCaptureUrn(uuid);
  const userUrn = user.id;
  const sessionQuery = sessionId
    ? `OPTIONAL MATCH (u)-[:CREATED]-(s:Session {id:"${sessionId}"})`
    : ``;
  const query = `MATCH (u:User {id:"${userUrn}"})
  ${sessionQuery}
  CREATE (u)-[created:CREATED]->(n:Capture {id:"${captureUrn}",
  body:"${escape(body)}", 
  created:TIMESTAMP()})
  ${sessionId ? "CREATE (n)<-[:INCLUDES]-(s)" : ""}
  RETURN n`;
  return executeQuery(query).then((result: StatementResult) => {
    const record = result.records[0].get("n");
    return new GraphNode(
      record.properties.id,
      "Capture",
      record.properties.body,
      0
    );
  });
}

function escape(text: string): string {
  return text.replace(/\"/g, '\\"');
}

function createEntityNodeWithEdge(
  captureUrn: string,
  entity: NLPEntity
): Promise<any> {
  const urn = toEntityUrn(`${entity.name};${entity.type}`);
  return executeQuery(`
    MATCH (capture {id: "${captureUrn}"})
    MERGE (entity:Entity {
      id: "${urn}",
      name: "${entity.name}",
      type: "${entity.type}"
    })
    CREATE (entity)<-[r:REFERENCES { salience: ${entity.salience} }]-(capture)
    RETURN entity
  `);
}

function createTagNodeWithEdge(
  tag: string,
  toNodeUrn: string
): Promise<GraphNode> {
  return executeQuery(`
    MATCH (to {id: "${toNodeUrn}"})
    MERGE (tag:Tag {
      id: "${toTagUrn(tag)}",
      name: "${tag}"
    })
    ON CREATE SET tag.created = TIMESTAMP()
    CREATE (tag)<-[r:TAGGED_WITH]-(to)
    RETURN tag
  `).then((result: StatementResult) => {
    const record = result.records[0].get("tag");
    return new GraphNode(
      record.properties.id,
      "Tag",
      record.properties.name,
      null
    );
  });
}

function executeQuery(cypherQuery: string): Promise<StatementResult> {
  return session
    .run(cypherQuery)
    .then(result => {
      session.close();
      return result;
    })
    .catch(error => {
      session.close();
      console.log(error);
      throw error;
    });
}

export {
  getUser,
  executeQuery,
  archiveCaptureNode,
  createCaptureNode,
  createSession,
  editCaptureNode,
  createTagNodeWithEdge,
  createEntityNodeWithEdge
};
