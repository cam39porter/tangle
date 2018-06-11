import { Urn } from "./urn";

export class UserUrn extends Urn {
  public static fromRaw(raw: string): UserUrn {
    return new UserUrn(raw.split(":")[3]);
  }
  constructor(id: string) {
    super(id, "user");
  }
}
