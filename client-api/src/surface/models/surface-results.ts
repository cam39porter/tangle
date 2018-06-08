import { Graph } from "./graph";
import { PageInfo } from "./page-info";
import { ListItem } from "./list-item";
import { GraphNode } from "./graph-node";

export class SurfaceResults {
  public header: string;
  public pivot: GraphNode;
  public graph: Graph;
  public list: ListItem[];
  public pageInfo: PageInfo;
  constructor(
    graph: Graph,
    list: ListItem[],
    pageInfo: PageInfo,
    pivot = null
  ) {
    this.graph = graph;
    this.list = list;
    this.pageInfo = pageInfo;
    this.pivot = pivot;
    this.header = "Header is deprecated. Fix this Cam";
  }
}
