export class Annotation {
  public type: string;
  public start: number;
  public end: number;
  public id: string | null;
  constructor(type: string, start: number, end: number, id: string | null) {
    this.type = type;
    this.start = start;
    this.end = end;
    this.id = id;
  }
}
