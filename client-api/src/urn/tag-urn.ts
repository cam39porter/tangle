import { Urn } from "./urn";

export class TagUrn extends Urn {
  public static fromRaw(raw: string): TagUrn {
    return new TagUrn(raw.split(":")[3]);
  }
  constructor(id: string) {
    super(id, "tag");
  }
}
