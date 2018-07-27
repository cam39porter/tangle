import { Urn } from "./urn";

export class CapturedLinkUrn extends Urn {
  public static fromRaw(raw: string): CapturedLinkUrn {
    return new CapturedLinkUrn(raw.split(":")[3]);
  }
  constructor(id: string) {
    super(id, "capturedLink");
  }
}
