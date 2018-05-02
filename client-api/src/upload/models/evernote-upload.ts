export class EvernoteUpload {
  public id: string;
  public created: number;
  public lastModified: number;
  public tags: string[];
  public title: string;
  // Currently keep html. We will need to revisit this
  public contents: string[];
  constructor(
    id: string,
    created: number,
    lastModified: number,
    tags: string[],
    title: string,
    contents: string[]
  ) {
    this.id = id;
    this.created = created;
    this.lastModified = lastModified;
    this.tags = tags;
    this.title = title;
    this.contents = contents;
  }
}
