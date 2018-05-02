import { StatementResult } from "neo4j-driver/types/v1";
import { toTagUrn } from "../../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Tag } from "../models/tag";

export function upsert(name: string, captureId: string): Promise<Tag> {
  const id = toTagUrn(name);
  const query = `MERGE (tag:Tag {
    id: {id},
    name: {name}
  })
  ON CREATE SET tag.created = TIMESTAMP()
  WITH tag
  MATCH (capture:Capture {id:{captureId}})
  CREATE (tag)<-[:TAGGED_WITH]-(capture)
  RETURN tag`;
  const params = { id, name, captureId };
  return executeQuery(query, params).then((result: StatementResult) => {
    return result.records[0].get("tag").properties as Tag;
  });
}
