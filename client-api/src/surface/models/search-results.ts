import { Graph } from "./graph";
import { PageInfo } from "./page-info";
import { ListItem } from "./list-item";

export class SearchResults {
  public graph: Graph;
  public header: string | null;
  public list: ListItem[];
  public pageInfo: PageInfo;
  constructor(
    header: string | null,
    graph: Graph,
    list: ListItem[],
    pageInfo: PageInfo
  ) {
    this.graph = graph;
    this.header = header;
    this.list = list;
    this.pageInfo = pageInfo;
  }
}
