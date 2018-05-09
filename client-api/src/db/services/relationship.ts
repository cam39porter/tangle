import { executeQuery } from "../db";

export function create(
  src: string,
  srcLabel: string,
  dest: string,
  destLabel: string,
  relationshipType: string
): Promise<void> {
  const params = {
    src,
    dest
  };
  const query = `
    MATCH (from:${srcLabel} {id:{src}})
    MATCH (to:${destLabel} {id:{dest}})
    CREATE (from)-[r:${relationshipType}]->(to)
    RETURN r`;

  return executeQuery(query, params).then(() => null);
}
