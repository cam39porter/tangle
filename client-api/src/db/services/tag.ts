import { StatementResult } from "neo4j-driver/types/v1";
import { toTagUrn } from "../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Tag } from "../models/tag";
import { UserUrn } from "../../urn/user-urn";

export function upsert(
  userId: UserUrn,
  name: string,
  parentId: string,
  parentLabel: string
): Promise<Tag> {
  const id = toTagUrn(userId, name);
  const query = `MERGE (tag:Tag {
    id: {id},
    name: {name},
    owner: {userId}
  })
  ON CREATE SET tag.created = TIMESTAMP()
  WITH tag
  MATCH (parent:${parentLabel} {id:{parentId}})
  CREATE (tag)<-[:TAGGED_WITH]-(parent)
  RETURN tag`;
  const params = { userId: userId.toRaw(), id, name, parentId };
  return executeQuery(query, params).then((result: StatementResult) => {
    return result.records[0].get("tag").properties as Tag;
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
  const params = { userId: userId.toRaw(), srcId };
  return executeQuery(query, params).then((result: StatementResult) => {
    return result.records.map(record => record.get("tag").properties as Tag);
  });
}
