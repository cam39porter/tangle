import { PagingInfo } from "./paging-info";

export class CollectionResult<T> {
  public items: T[];
  public pagingInfo: PagingInfo;
  constructor(items: T[], pagingInfo: PagingInfo) {
    this.items = items;
    this.pagingInfo = pagingInfo;
  }
}
