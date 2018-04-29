import { v1 as neo4j } from "neo4j-driver";
import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { GraphNode, NLPEntity, User } from "../models";

import {
  toCaptureUrn,
  toEntityUrn,
  toLinkUrn,
  toTagUrn
} from "../helpers/urn-helpers";

const driver = neo4j.driver(
  process.env.NEO4J_ENDPOINT,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

function createUser(user: User) {
  return executeQuery(`
  MERGE (u:User {
    id:"${user.id}",
    name:"${user.name}",
    email:"${user.email}"
  })
  ON CREATE SET u.created=TIMESTAMP()
  RETURN u`);
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
  ).then(() => null);
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
  RETURN n`).then(() => {
    return true;
  });
}

function createCaptureNode(
  user: User,
  body: string,
  parentId: string
): Promise<GraphNode> {
  const uuid = uuidv4();
  const captureUrn = toCaptureUrn(uuid);
  const userUrn = user.id;
  const parentQuery = parentId
    ? `OPTIONAL MATCH (u)-[:CREATED]-(parent {id:"${parentId}"}) WHERE parent:Session OR parent:EvernoteNote`
    : ``;
  const query = `MATCH (u:User {id:"${userUrn}"})
  ${parentQuery}
  CREATE (u)-[created:CREATED]->(n:Capture {id:"${captureUrn}",
  body:"${escape(body)}",
  created:TIMESTAMP()})
  ${parentId ? "CREATE (n)<-[:INCLUDES]-(parent)" : ""}
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

function createLinkNodeWithEdge(link: string, captureId: string) {
  return executeQuery(`
    MATCH (capture:Capture {id: "${captureId}"})
    MERGE (link:Link {
      id: "${toLinkUrn(link)}",
      url: "${link}"
    })
    ON CREATE SET link.created = TIMESTAMP()
    CREATE (link)<-[:LINKS_TO]-(capture)
    RETURN link
  `).then((result: StatementResult) => {
    const record = result.records[0].get("link");
    return new GraphNode(
      record.properties.id,
      "Link",
      record.properties.url,
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
  createUser,
  editCaptureNode,
  createTagNodeWithEdge,
  createEntityNodeWithEdge,
  createLinkNodeWithEdge
};
