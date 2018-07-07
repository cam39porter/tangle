import { Session } from "../../db/models/session";

export class GraphNode {
  public id: string;
  public type: string;
  public text: string;
  public resultClass: string;
  public parents: Session[];
  constructor(
    id: string,
    type: string,
    text: string,
    resultClass: string,
    parents: Session[]
  ) {
    this.id = id;
    this.type = type;
    this.text = text;
    this.resultClass = resultClass;
    this.parents = parents;
  }
}
