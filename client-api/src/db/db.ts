import { GraphNode } from "../models";

const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  "bolt+routing://35.197.47.235:7687",
  neo4j.auth.basic("neo4j", "Z868sybiq7cGzFeA")
);
const session = driver.session();

function createNode(node: GraphNode): Promise<GraphNode> {
  return executeQuery(
    `MERGE (n:${node.type} {id:"${node.id}", body:"${
      node.text
    }"}) ON CREATE SET n.created = TIMESTAMP() RETURN n`
  ).then(result => {
    const record = result.records[0];
    return new GraphNode(
      record.get("n").properties.id,
      "CAPTURE",
      record.get("n").properties.body,
      0
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

export { executeQuery, createNode };
