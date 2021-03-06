export class PagingContext {
  public static DEFAULT = new PagingContext(null, 10);
  public static INTERVAL_DEFAULT = new PagingContext("0", 10);
  public pageId: string | null;
  public count: number;
  constructor(pageId: string, count: number) {
    this.pageId = pageId;
    this.count = count;
  }
}
