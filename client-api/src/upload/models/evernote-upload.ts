export class EvernoteUpload {
  public created: number;
  public lastModified: number;
  public tags: string[];
  public title: string;
  public body: string;
  public rawSize: number;
  constructor(
    created: number,
    lastModified: number,
    tags: string[],
    title: string,
    body: string,
    rawSize: number
  ) {
    this.created = created;
    this.lastModified = lastModified;
    this.tags = tags;
    this.title = title;
    this.body = body;
    this.rawSize = rawSize;
  }
}
