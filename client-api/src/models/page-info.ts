export class PageInfo {
  start: number;
  count: number;
  total: number;
  constructor(start: number, count: number, total: number) {
    this.start = start;
    this.count = count;
    this.total = total;
  }
}
