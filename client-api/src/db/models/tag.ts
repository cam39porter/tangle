import { TagUrn } from "../../urn/tag-urn";

export class Tag {
  public urn: TagUrn;
  public name: string;
  public created: number;
  constructor(urn: TagUrn, name: string, created: number) {
    this.urn = urn;
    this.name = name;
    this.created = created;
  }
}
