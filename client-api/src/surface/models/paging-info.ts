export class PagingInfo {
  public nextPageId: string | null;
  public total: number | null;
  constructor(nextPageId: string, total: number) {
    this.nextPageId = nextPageId;
    this.total = total;
  }
}
