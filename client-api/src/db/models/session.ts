export class Session {
  public id: string;
  public title: string;
  public created: number;
  constructor(id: string, title: string, created: number) {
    this.id = id;
    this.title = title;
    this.created = created;
  }
}
