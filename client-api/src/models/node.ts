export class GraphNode {
  id: string;
  type: string;
  text: string;
  level: number;
  constructor(id: string, type: string, text: string, level: number) {
    this.id = id;
    this.type = type;
    this.text = text;
    this.level = level;
  }
}
