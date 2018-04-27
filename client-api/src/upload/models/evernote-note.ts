export class EvernoteNote {
  id: string;
  created: number;
  lastModified: number;
  tags: string[];
  title: string;
  // Currently keep html. We will need to revisit this
  contents: string[];
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
