import { Urn } from "./urn";

export class CaptureUrn extends Urn {
  public static fromRaw(raw: string): CaptureUrn {
    return new CaptureUrn(raw.split(":")[3]);
  }

  public static fromUrn(urn: Urn): CaptureUrn {
    return new CaptureUrn(urn.getId());
  }

  public static isCaptureUrn(urn: Urn): boolean {
    return urn.getType() === CaptureUrn.type;
  }

  private static type: string = "capture";

  constructor(id: string) {
    super(id, CaptureUrn.type);
  }
}
