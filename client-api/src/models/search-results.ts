import { Graph } from "./graph";
import { PageInfo } from ".";

export class SearchResults {
  graph: Graph;
  pageInfo: PageInfo;
  constructor(graph: Graph, pageInfo: PageInfo) {
    this.graph = graph;
    this.pageInfo = pageInfo;
  }
}
