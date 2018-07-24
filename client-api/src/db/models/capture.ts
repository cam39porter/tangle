import { CaptureUrn } from "../../urn/capture-urn";
import { Session } from "./session";

export class Capture {
  public urn: CaptureUrn;
  public body: string;
  public created: number;
  public lastModified: number;
  public authorName: string;
  public parents: Session[];

  constructor(
    urn: CaptureUrn,
    body: string,
    created: number,
    lastModified: number,
    authorName?: string
  ) {
    this.urn = urn;
    this.body = body;
    this.created = created;
    this.lastModified = lastModified;
    this.authorName = authorName;
  }
}
