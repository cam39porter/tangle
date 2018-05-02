export class EvernoteNote {
  public id: string;
  public created: number;
  public lastModified: number;
  public title: string;
  constructor(
    id: string,
    created: number,
    lastModified: number,
    title: string
  ) {
    this.id = id;
    this.created = created;
    this.lastModified = lastModified;
    this.title = title;
  }
}
