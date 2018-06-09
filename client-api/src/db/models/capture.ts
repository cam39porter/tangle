import { CaptureUrn } from "../../urn/capture-urn";

export class Capture {
  public static fromProperties(properties): Capture {
    return new Capture(
      CaptureUrn.fromRaw(properties["id"]),
      properties["body"],
      properties["created"]
    );
  }

  public urn: CaptureUrn;
  public body: string;
  public created: number;

  constructor(urn: CaptureUrn, body: string, created: number) {
    this.urn = urn;
    this.body = body;
    this.created = created;
  }
}
