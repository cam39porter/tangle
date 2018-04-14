import { GraphNode, User } from "../models";
import { v1 as neo4j } from "neo4j-driver";
import { v4 as uuidv4 } from "uuid/v4";
import { StatementResult } from "neo4j-driver/types/v1";

const driver = neo4j.driver(
  "bolt://35.197.102.210:7687",
  neo4j.auth.basic("neo4j", "Z868sybiq7cGzFeA")
);
const session = driver.session();

function getUser(uid: string): Promise<User> {
  return executeQuery(`
  MATCH (u:User {id:"${uid}"})
  RETURN u`).then((result: StatementResult) => {
    return result.records[0].get("u").properties as User;
  });
}

function deleteCaptureNode(id: string, captureId: string): Promise<void> {
  return executeQuery(
    `MATCH (c:Capture {id:"${captureId}"})<-[:CREATED]-(u:User {id:"${id}"})
    DETACH DELETE c
    `
  ).then(result => null);
}

function createCaptureNode(user: User, body: string): Promise<GraphNode> {
  const uuid = uuidv4();
  return executeQuery(
    `MERGE (u:User {id:"${user.id}", name:"${user.name}", email:"${
      user.email
    }"})
    MERGE (n:Capture {id:"${uuid}", body:"${escape(body)}"})
    ON CREATE SET n.created = TIMESTAMP()
    CREATE (u)-[created:CREATED]->(n)
    RETURN n`
  ).then((result: StatementResult) => {
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

function createTagNodeWithEdge(
  tag: string,
  toNodeId: string
): Promise<GraphNode> {
  return executeQuery(`
    MATCH (to {id: "${toNodeId}"})
    MERGE (tag:Tag {
      id: "${tag}",
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
  deleteCaptureNode,
  createCaptureNode,
  createTagNodeWithEdge
};
