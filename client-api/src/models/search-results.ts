import { PageInfo } from ".";
import { Graph } from "./graph";

export class SearchResults {
  public graph: Graph;
  public pageInfo: PageInfo;
  constructor(graph: Graph, pageInfo: PageInfo) {
    this.graph = graph;
    this.pageInfo = pageInfo;
  }
}
