import { StatementResult } from "neo4j-driver/types/v1";
import { toEntityUrn } from "../../helpers/urn-helpers";
import { executeQueryWithParams } from "../db";
import { Entity } from "../models/entity";

export function upsertEntity(
  name: string,
  type: string,
  salience: number,
  captureUrn: string
): Promise<Entity> {
  const entityUrn = toEntityUrn(`${name};${type}`);
  const params = { entityUrn, name, type, captureUrn, salience };
  const query = `
  MATCH (capture {id: {captureUrn}})
  MERGE (entity:Entity {
    id: {entityUrn},
    name: {name},
    type: {type}
  })
  CREATE (entity)<-[r:REFERENCES {salience: {salience}}]-(capture)
  RETURN entity
`;
  return executeQueryWithParams(query, params).then(
    (result: StatementResult) => {
      return result.records[0].get("entity").properties as Entity;
    }
  );
}
