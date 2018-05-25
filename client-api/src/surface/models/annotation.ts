export class Annotation {
  public type: string;
  public start: number;
  public end: number;
  public linkToId: string | null;
  constructor(
    type: string,
    start: number,
    end: number,
    linkToId: string | null
  ) {
    this.type = type;
    this.start = start;
    this.end = end;
    this.linkToId = linkToId;
  }
}
