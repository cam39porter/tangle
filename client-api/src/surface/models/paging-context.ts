export class PagingContext {
  public pageId: string | null;
  public count: number;
  constructor(pageId: string, count: number) {
    this.pageId = pageId;
    this.count = count;
  }
}
