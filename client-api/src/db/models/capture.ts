import { CaptureUrn } from "../../urn/capture-urn";

export class Capture {
  public urn: CaptureUrn;
  public body: string;
  public created: number;

  constructor(urn: CaptureUrn, body: string, created: number) {
    this.urn = urn;
    this.body = body;
    this.created = created;
  }
}
