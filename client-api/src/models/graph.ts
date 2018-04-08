import { Edge, GraphNode } from ".";

export class Graph {
  nodes: GraphNode[];
  edges: Edge[];
  constructor(nodes: GraphNode[], edges: Edge[]) {
    this.nodes = nodes || [];
    this.edges = edges || [];
  }
}
