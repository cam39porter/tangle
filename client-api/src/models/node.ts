export class Node {
  id: string;
  type: string;
  text: string;
  constructor(id: string, type: string, text: string) {
    this.id = id;
    this.type = type;
    this.text = text;
  }
}
