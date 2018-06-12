import { StatementResult } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { executeQuery } from "../db";
import { Entity } from "../models/entity";
import { CaptureUrn } from "../../urn/capture-urn";
import { UserUrn } from "../../urn/user-urn";
import { EntityUrn } from "../../urn/entity-urn";
import { ENTITY_LABEL, CAPTURE_LABEL } from "../helpers/labels";
import { createRelationship } from "./relationship";
import { REFERENCES_RELATIONSHIP } from "../helpers/relationships";

function getEntityByNameNullable(
  user: UserUrn,
  name: string,
  type: string
): Promise<Entity | null> {
  const query = `
  MATCH (entity:Entity {name: {name}, type:{type}, owner: {userUrn}})
  RETURN entity`;
  const params = { userUrn: user.toRaw(), name, type };
  return executeQuery(query, params).then(result => {
    return (
      (result.records[0] &&
        buildFromNeo(result.records[0].get("entity").properties)) ||
      null
    );
  });
}

export function upsertEntity(
  userId: UserUrn,
  name: string,
  type: string,
  salience: number,
  captureUrn: CaptureUrn
): Promise<Entity> {
  return getEntityByNameNullable(userId, name, type).then(existingEntity => {
    if (existingEntity) {
      return createRelationship(
        userId,
        captureUrn.toRaw(),
        CAPTURE_LABEL,
        existingEntity.urn.toRaw(),
        ENTITY_LABEL,
        REFERENCES_RELATIONSHIP
      ).then(() => existingEntity);
    } else {
      return createWithRelationship(userId, name, type, salience, captureUrn);
    }
  });
}

function createWithRelationship(
  userId: UserUrn,
  name: string,
  type: string,
  salience: number,
  captureUrn: CaptureUrn
): Promise<Entity> {
  const uuid = uuidv4();
  const params = {
    userId: userId.toRaw(),
    entityUrn: new EntityUrn(uuid).toRaw(),
    name,
    type,
    captureUrn: captureUrn.toRaw(),
    salience
  };
  const query = `
  MATCH (capture {id: {captureUrn}})
  CREATE (entity:Entity {
    id: {entityUrn},
    name: {name},
    type: {type},
    owner: {userId}
  })
  CREATE (entity)<-[r:REFERENCES {salience: {salience}}]-(capture)
  RETURN entity
`;
  return executeQuery(query, params).then((result: StatementResult) => {
    return buildFromNeo(result.records[0].get("entity").properties);
  });
}

function buildFromNeo(props: any): Entity {
  return new Entity(
    EntityUrn.fromRaw(props["id"]),
    props["name"],
    props["type"]
  );
}
