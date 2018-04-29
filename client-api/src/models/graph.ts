import { Edge, GraphNode } from ".";

export class Graph {
  public nodes: GraphNode[];
  public edges: Edge[];
  constructor(nodes: GraphNode[], edges: Edge[]) {
    this.nodes = nodes || [];
    this.edges = edges || [];
  }
}
