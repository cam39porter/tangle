import { EntityUrn } from "../../urn/entity-urn";

export class Entity {
  public urn: EntityUrn;
  public name: string;
  public type: string;
  constructor(urn: EntityUrn, name: string, type: string) {
    this.urn = urn;
    this.name = name;
    this.type = type;
  }
}
