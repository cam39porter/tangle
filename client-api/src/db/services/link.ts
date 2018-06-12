import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery } from "../db";
import { Link } from "../models/link";
import { CaptureUrn } from "../../urn/capture-urn";
import { UserUrn } from "../../urn/user-urn";
import { v4 as uuidv4 } from "uuid/v4";

export function upsert(
  userId: UserUrn,
  url: string,
  captureUrn: CaptureUrn
): Promise<Link> {
  const uuid = uuidv4();
  const params = {
    userId: userId.toRaw(),
    captureId: captureUrn.toRaw(),
    id: uuid,
    url
  };
  const query = `
    MATCH (capture:Capture {id: {captureId}})
    MERGE (link:Link {
      id: {id},
      url: {url},
      owner: {userId}
    })
    ON CREATE SET link.created = TIMESTAMP()
    CREATE (link)<-[:LINKS_TO]-(capture)
    RETURN link`;
  return executeQuery(query, params).then((result: StatementResult) => {
    return result.records[0].get("link") as Link;
  });
}
