import { Graph } from "./graph";
import { PageInfo } from "./page-info";
import { ListItem } from "./list-item";

export class SearchResults {
  public graph: Graph;
  public list: ListItem[];
  public pageInfo: PageInfo;
  constructor(graph: Graph, list: ListItem[], pageInfo: PageInfo) {
    this.graph = graph;
    this.list = list;
    this.pageInfo = pageInfo;
  }
}
