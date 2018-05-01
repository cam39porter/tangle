export class Link {
  public id: string;
  public url: string;
  public created: number;
  constructor(id: string, url: string, created: number) {
    this.id = id;
    this.url = url;
    this.created = created;
  }
}
