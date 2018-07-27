import { Node } from "neo4j-driver/types/v1";
import { v4 as uuidv4 } from "uuid/v4";
import { escape } from "../../helpers/capture-parser";
import { executeQuery, Param } from "../db";
import { UserUrn } from "../../urn/user-urn";
import { CapturedLink } from "../models/captured-link";
import { CapturedLinkUrn } from "../../urn/captured-link-urn";

export function createCapturedLink(
  userId: UserUrn,
  title: string,
  url: string,
  content: string,
  byline: string | null,
  length: number | null
): Promise<CapturedLink> {
  const uuid = uuidv4();
  const capturedLinkUrn = new CapturedLinkUrn(uuid);
  const now = Date.now();
  const query = `MATCH (u:User {id:{userId}})
    CREATE (u)-[created:CREATED]->(capturedLink:CapturedLink {
      id:{capturedLinkUrn},
      owner:{userId},
      title:{url},
      content:{content},
      title:{title},
      created:{created},
      lastModified:{lastModified}
      ${byline ? ",byline:{byline}" : ""}
      ${length ? ",length:{length}" : ""}
    })
    RETURN capturedLink`;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("capturedLinkUrn", capturedLinkUrn.toRaw()),
    new Param("title", escape(title)),
    new Param("url", escape(url)),
    new Param("content", escape(content)),
    new Param("lastModified", now.toString()),
    new Param("created", now.toString()),
    new Param("byline", content),
    new Param("length", length)
  ];
  return executeQuery(query, params).then(res => {
    return format(res.records[0].get("capturedLink"));
  });

  function format(record: Node): CapturedLink {
    return buildFromProps(record.properties);
  }
  function buildFromProps(props: object): CapturedLink {
    return new CapturedLink(
      CapturedLinkUrn.fromRaw(props["id"]),
      props["title"],
      props["url"],
      props["content"],
      props["created"],
      props["lastModified"],
      props["byline"],
      props["length"]
    );
  }
}
