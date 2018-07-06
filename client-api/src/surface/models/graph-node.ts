import { Session } from "../../db/models/session";

export class GraphNode {
  public id: string;
  public type: string;
  public text: string;
  public level: number;
  public parents: Session[];
  constructor(
    id: string,
    type: string,
    text: string,
    level: number,
    parents: Session[]
  ) {
    this.id = id;
    this.type = type;
    this.text = text;
    this.level = level;
    this.parents = parents;
  }
}
