import { StatementResult } from "neo4j-driver/types/v1";
import { toEntityUrn } from "../../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Entity } from "../models/entity";

export function upsertEntity(
  userId: string,
  name: string,
  type: string,
  salience: number,
  captureUrn: string
): Promise<Entity> {
  const entityUrn = toEntityUrn(userId, name, type);
  const params = { userId, entityUrn, name, type, captureUrn, salience };
  const query = `
  MATCH (capture {id: {captureUrn}})
  MERGE (entity:Entity {
    id: {entityUrn},
    name: {name},
    type: {type},
    owner: {userId}
  })
  CREATE (entity)<-[r:REFERENCES {salience: {salience}}]-(capture)
  RETURN entity
`;
  return executeQuery(query, params).then((result: StatementResult) => {
    return result.records[0].get("entity").properties as Entity;
  });
}
