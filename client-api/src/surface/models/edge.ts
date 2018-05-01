export class Edge {
  public source: string;
  public destination: string;
  public type: string;
  public salience: number;
  constructor(data) {
    this.source = data.source;
    this.destination = data.destination;
    this.type = data.type;
    this.salience = data.salience;
  }
}
