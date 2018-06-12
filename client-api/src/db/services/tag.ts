import { v4 as uuidv4 } from "uuid/v4";
import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery, Param } from "../db";
import { Tag } from "../models/tag";
import { UserUrn } from "../../urn/user-urn";
import { TagUrn } from "../../urn/tag-urn";
import { createRelationship } from "./relationship";
import { TAG_LABEL } from "../helpers/labels";
import { TAGGED_WITH_RELATIONSHIP } from "../helpers/relationships";
import { Label } from "../neo4j/label";
import { Urn } from "../../urn/urn";

function getTagByNameNullable(
  user: UserUrn,
  name: string
): Promise<Tag | null> {
  const query = `
  MATCH (tag:Tag {name: {name}, owner: {userUrn}})
  RETURN tag`;
  const params = [new Param("userUrn", user.toRaw()), new Param("name", name)];
  return executeQuery(query, params).then(result => {
    return (
      (result.records[0] &&
        buildFromNeo(result.records[0].get("tag").properties)) ||
      null
    );
  });
}

export function upsert(
  userId: UserUrn,
  name: string,
  parentUrn: Urn,
  parentLabel: Label
): Promise<Tag> {
  return getTagByNameNullable(userId, name).then(existingTag => {
    if (existingTag) {
      return createRelationship(
        userId,
        parentUrn.toRaw(),
        parentLabel,
        existingTag.urn.toRaw(),
        TAG_LABEL,
        TAGGED_WITH_RELATIONSHIP
      ).then(() => existingTag);
    } else {
      return createWithRelationship(userId, name, parentUrn, parentLabel);
    }
  });
}

function createWithRelationship(
  userId: UserUrn,
  name: string,
  parentUrn: Urn,
  parentLabel: Label
): Promise<Tag> {
  const uuid = uuidv4();
  const id = new TagUrn(uuid);
  const query = `MERGE (tag:Tag {
    id: {id},
    name: {name},
    owner: {userId}
  })
  ON CREATE SET tag.created = TIMESTAMP()
  WITH tag
  MATCH (parent:${parentLabel.name} {id:{parentId}})
  CREATE (tag)<-[:TAGGED_WITH]-(parent)
  RETURN tag`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("id", id.toRaw()),
    new Param("name", name),
    new Param("parentId", parentUrn.toRaw())
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    return buildFromNeo(result.records[0].get("tag").properties);
  });
}

export function getTags(
  userId: UserUrn,
  srcId: string,
  srcLabel: string
): Promise<Tag[]> {
  const query = `
  MATCH (tag:Tag {owner:{userId}})<-[:TAGGED_WITH]-(src:${srcLabel} {id:{srcId}})
  RETURN tag
  `;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("srcId", srcId)
  ];
  return executeQuery(query, params).then((result: StatementResult) => {
    return result.records.map(record =>
      buildFromNeo(record.get("tag").properties)
    );
  });
}

export function buildFromNeo(props: any): Tag {
  return new Tag(TagUrn.fromRaw(props["id"]), props["name"], props["created"]);
}
