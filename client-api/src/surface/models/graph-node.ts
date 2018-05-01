export class GraphNode {
  public id: string;
  public type: string;
  public text: string;
  public level: number;
  constructor(id: string, type: string, text: string, level: number) {
    this.id = id;
    this.type = type;
    this.text = text;
    this.level = level;
  }
}
