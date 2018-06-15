import { CaptureUrn } from "../../urn/capture-urn";
import { Session } from "./session";

export class Capture {
  public urn: CaptureUrn;
  public body: string;
  public created: number;
  public parents: Session[];

  constructor(urn: CaptureUrn, body: string, created: number) {
    this.urn = urn;
    this.body = body;
    this.created = created;
  }
}
