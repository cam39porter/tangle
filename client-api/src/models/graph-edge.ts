export class GraphEdge {
  source: string;
  destination: string;
  constructor(data) {
    this.source = data.source;
    this.destination = data.destination;
  }
}
