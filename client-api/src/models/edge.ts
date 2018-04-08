export class Edge {
  source: string;
  destination: string;
  type: string;
  salience: number;
  constructor(data) {
    this.source = data.source;
    this.destination = data.destination;
    this.type = data.type;
    this.salience = data.salience;
  }
}
