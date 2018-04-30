export class Tag {
  public id: string;
  public name: string;
  public created: number;
  constructor(id: string, name: string, created: number) {
    this.id = id;
    this.name = name;
    this.created = created;
  }
}
