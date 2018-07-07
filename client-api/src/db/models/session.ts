import { SessionUrn } from "../../urn/session-urn";
import { CollectionResult } from "../../surface/models/collection-result";
import { Capture } from "./capture";

export class Session {
  public static fromProperties(properties): Session {
    return new Session(
      SessionUrn.fromRaw(properties["id"]),
      properties["title"],
      properties["created"],
      properties["lastModified"] || properties["created"]
    );
  }
  public urn: SessionUrn;
  public title: string;
  public created: number;
  public lastModified: number;
  public itemCollection: CollectionResult<Capture>;
  constructor(
    urn: SessionUrn,
    title: string,
    created: number,
    lastModified: number
  ) {
    this.urn = urn;
    this.title = title;
    this.created = created;
    this.lastModified = lastModified;
  }
}
