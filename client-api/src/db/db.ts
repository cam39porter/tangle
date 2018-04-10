import { GraphNode } from "../models";
const uuidv4 = require("uuid/v4");
const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  "bolt+routing://35.197.47.235:7687",
  neo4j.auth.basic("neo4j", "Z868sybiq7cGzFeA")
);
const session = driver.session();

function createCaptureNode(body: string): Promise<GraphNode> {
  const uuid = uuidv4();
  return executeQuery(
    `MERGE (n:Capture {id:"${uuid}", body:"${body}"})
    ON CREATE SET n.created = TIMESTAMP()
    RETURN n`
  ).then(result => {
    const record = result.records[0].get("n");
    return new GraphNode(
      record.properties.id,
      "CAPTURE",
      record.properties.body,
      0
    );
  });
}

function createTagNodeWithEdge(tag: string, toNodeId: string): GraphNode {
  return executeQuery(`
    MATCH (to {id: "${toNodeId}"})
    MERGE (tag:Tag {
      id: "${tag}",
      name: "${tag}"
    })
    ON CREATE SET tag.created = TIMESTAMP()
    CREATE (tag)<-[r:TAGGED_WITH]-(to)
    RETURN tag
  `).then(result => {
    const record = result.records[0].get("tag");
    return new GraphNode(
      record.properties.id,
      "TAG",
      record.properties.name,
      null
    );
  });
}

function executeQuery(cypherQuery) {
  return session
    .run(cypherQuery)
    .then(result => {
      session.close();
      return result;
    })
    .catch(error => {
      session.close();
      console.log(error);
    });
}

export { executeQuery, createCaptureNode, createTagNodeWithEdge };
