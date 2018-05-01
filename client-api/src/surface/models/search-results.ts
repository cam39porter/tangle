import { Graph } from "./graph";
import { PageInfo } from "./page-info";

export class SearchResults {
  public graph: Graph;
  public pageInfo: PageInfo;
  constructor(graph: Graph, pageInfo: PageInfo) {
    this.graph = graph;
    this.pageInfo = pageInfo;
  }
}
