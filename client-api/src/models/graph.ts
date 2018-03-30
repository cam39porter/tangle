import { GraphEdge, Entity, Capture } from ".";

export class Graph {
  captures: Capture[];
  entities: Entity[];
  edges: GraphEdge[];
  constructor(data) {
    this.captures = data.captures || [];
    this.entities = data.entities || [];
    this.edges = data.edges || [];
  }
}
