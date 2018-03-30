export class Entity {
  id: string;
  name: string;
  type: string;
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
  }
}
