import { Urn } from "./urn";

export class SessionUrn extends Urn {
  public static fromRaw(raw: string): SessionUrn {
    return new SessionUrn(raw.split(":")[3]);
  }
  constructor(id: string) {
    super(id, "session");
  }
}
