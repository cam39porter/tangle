import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery } from "../db";
import { toEntityUrn } from "../helpers/urn-helpers";
import { Entity } from "../models/entity";
import { CaptureUrn } from "../../urn/capture-urn";
import { UserUrn } from "../../urn/user-urn";

export function upsertEntity(
  userId: UserUrn,
  name: string,
  type: string,
  salience: number,
  captureUrn: CaptureUrn
): Promise<Entity> {
  const entityUrn = toEntityUrn(userId, name, type);
  const params = {
    userId: userId.toRaw(),
    entityUrn,
    name,
    type,
    captureUrn: captureUrn.toRaw(),
    salience
  };
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
