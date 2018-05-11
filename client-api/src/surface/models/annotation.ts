export class Annotation {
  public type: string;
  public start: number;
  public end: number;
  constructor(type: string, start: number, end: number) {
    this.type = type;
    this.start = start;
    this.end = end;
  }
}
