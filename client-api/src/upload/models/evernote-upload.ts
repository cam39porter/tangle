export class EvernoteUpload {
  public created: number;
  public lastModified: number;
  public tags: string[];
  public title: string;
  // Currently keep html. We will need to revisit this
  public contents: string[];
  constructor(
    created: number,
    lastModified: number,
    tags: string[],
    title: string,
    contents: string[]
  ) {
    this.created = created;
    this.lastModified = lastModified;
    this.tags = tags;
    this.title = title;
    this.contents = contents;
  }
}
