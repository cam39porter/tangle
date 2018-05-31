import { executeQuery } from "../db";
import { Label } from "../neo4j/label";
import { Relationship } from "../neo4j/relationship";

export function createRelationship(
  userId: string,
  src: string,
  srcLabel: Label,
  dest: string,
  destLabel: Label,
  relationshipType: Relationship
): Promise<void> {
  const params = {
    src,
    dest,
    userId
  };
  const query = `
    MATCH (from:${srcLabel.name} {id:{src}, owner:{userId}})
    MATCH (to:${destLabel.name} {id:{dest}, owner:{userId}})
    CREATE (from)-[r:${relationshipType.name}]->(to)
    SET r.created = TIMESTAMP()
    RETURN r`;

  return executeQuery(query, params).then(() => {
    return null;
  });
}

export function deleteRelationship(
  userId: string,
  src: string,
  srcLabel: Label,
  dest: string,
  destLabel: Label,
  relationshipType: Relationship
): Promise<void> {
  const params = {
    src,
    dest,
    userId
  };
  const query = `
    MATCH (from:${srcLabel.name} {id:{src}, owner:{userId}})
      -[r:${relationshipType.name}]
      ->(to:${destLabel.name} {id:{dest}, owner:{userId}})
    DELETE r`;

  return executeQuery(query, params).then(() => {
    return null;
  });
}
