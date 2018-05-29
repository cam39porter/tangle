import { Graph } from "./graph";
import { PageInfo } from "./page-info";
import { ListItem } from "./list-item";

export class SearchResults {
  public header: string | null;
  public graph: Graph;
  public list: ListItem[];
  public pageInfo: PageInfo;
  constructor(
    header: string | null,
    graph: Graph,
    list: ListItem[],
    pageInfo: PageInfo
  ) {
    this.header = header;
    this.graph = graph;
    this.list = list;
    this.pageInfo = pageInfo;
  }
}
