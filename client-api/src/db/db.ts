import { GraphNode, User, NLPEntity } from "../models";
import { v1 as neo4j } from "neo4j-driver";
import { v4 as uuidv4 } from "uuid/v4";
import { StatementResult } from "neo4j-driver/types/v1";

import {
  toCaptureUrn,
  toTagUrn,
  toUserUrn,
  toEntityUrn
} from "../helpers/urn-helpers";

const driver = neo4j.driver(
  "bolt://35.197.102.210:7687",
  neo4j.auth.basic("neo4j", "Z868sybiq7cGzFeA")
);
const session = driver.session();

function getUser(urn: string): Promise<User> {
  return executeQuery(`
  MATCH (u:User {id:"${urn}"})
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
  const captureUrn = toCaptureUrn(uuid);
  const userUrn = user.id;
  return executeQuery(
    `MERGE (u:User {id:"${userUrn}", name:"${user.name}", email:"${
      user.email
    }"})
    MERGE (n:Capture {id:"${captureUrn}", body:"${escape(body)}"})
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
  deleteCaptureNode,
  createCaptureNode,
  createTagNodeWithEdge,
  createEntityNodeWithEdge
};
