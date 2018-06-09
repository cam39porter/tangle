import { Urn } from "./urn";

export class CaptureUrn extends Urn {
  public static fromRaw(raw: string): CaptureUrn {
    return new CaptureUrn(raw.split(":")[3]);
  }
  constructor(id: string) {
    super(id, "capture");
  }
}
