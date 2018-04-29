export class NLPEntityResponse {
  public entities: NLPEntity[];
  constructor() {
    this.entities = [];
  }
}

export class NLPEntity {
  public name: string;
  public type: string;
  public metadata: NLPMetadata;
  public sentiment: NLPSentiment;
  public salience: number;
  constructor(data) {
    this.name = data.name;
    this.type = data.type;
    this.metadata = data.metadata ? new NLPMetadata(data.metadata) : null;
    this.sentiment = data.sentiment ? new NLPSentiment(data.sentiment) : null;
    this.salience = data.salience;
  }
}

class NLPMetadata {
  public wikipedia: string;
  public mid: string;
  constructor(data) {
    this.wikipedia = data.wikipedia_url;
    this.mid = data.mid;
  }
}

class NLPSentiment {
  public magnitude: number;
  public score: number;
  constructor(data) {
    this.magnitude = data.magnitude;
    this.score = data.score;
  }
}
