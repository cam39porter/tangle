import { Edge, Entity, Capture } from ".";

export class Graph {
  nodes: Node[];
  edges: Edge[];
  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes || [];
    this.edges = edges || [];
  }
}
