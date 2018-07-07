import { Urn } from "./urn";

export class SessionUrn extends Urn {
  public static fromRaw(raw: string): SessionUrn {
    return new SessionUrn(raw.split(":")[3]);
  }

  public static isSessionUrn(urn: Urn): boolean {
    return urn.getType() === SessionUrn.type;
  }

  private static type: string = "session";

  constructor(id: string) {
    super(id, "session");
  }
}
