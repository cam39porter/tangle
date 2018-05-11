import { executeQuery } from "../db";

export function create(
  userId: string,
  src: string,
  srcLabel: string,
  dest: string,
  destLabel: string,
  relationshipType: string
): Promise<void> {
  const params = {
    src,
    dest,
    userId
  };
  const query = `
    MATCH (from:${srcLabel} {id:{src}, owner:{userId}})
    MATCH (to:${destLabel} {id:{dest}, owner:{userId}})
    CREATE (from)-[r:${relationshipType}]->(to)
    SET r.created = TIMESTAMP()
    RETURN r`;

  return executeQuery(query, params).then(() => null);
}
