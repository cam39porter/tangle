import { Urn } from "./urn";

export class EntityUrn extends Urn {
  public static fromRaw(raw: string): EntityUrn {
    return new EntityUrn(raw.split(":")[3]);
  }
  constructor(id: string) {
    super(id, "entity");
  }
}
