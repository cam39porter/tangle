// import { PagingInfo } from "./paging-info";

export class Session {
  public id: string;
  public title: string;
  public created: number;
  // public itemsPagingInfo: PagingInfo;
  // public lastModified: number;
  constructor(
    id: string,
    title: string,
    created: number
    // lastModifed: number
  ) {
    this.id = id;
    this.title = title;
    this.created = created;
    // this.lastModified = lastModifed;
  }
}
