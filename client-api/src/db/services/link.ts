import { StatementResult } from "neo4j-driver/types/v1";
import { toLinkUrn } from "../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Link } from "../models/link";
import { CaptureUrn } from "../../urn/capture-urn";

export function upsert(
  userId: string,
  url: string,
  captureUrn: CaptureUrn
): Promise<Link> {
  const params = { userId, id: toLinkUrn(userId, url), url };
  const query = `
    MATCH (capture:Capture {id: "${captureUrn.toString()}"})
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
