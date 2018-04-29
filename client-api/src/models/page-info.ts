export class PageInfo {
  public start: number;
  public count: number;
  public total: number;
  constructor(start: number, count: number, total: number) {
    this.start = start;
    this.count = count;
    this.total = total;
  }
}
