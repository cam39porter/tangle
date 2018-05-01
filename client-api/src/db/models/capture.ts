export class Capture {
  public id: string;
  public body: string;
  public created: number;
  constructor(id: string, body: string, created: number) {
    this.id = id;
    this.body = body;
    this.created = created;
  }
}
