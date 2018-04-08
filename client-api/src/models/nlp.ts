export class NLPEntityResponse {
  entities: NLPEntity[];
  constructor() {
    this.entities = [];
  }
}

export class NLPEntity {
  name: string;
  type: string;
  metadata: NLPMetadata;
  sentiment: NLPSentiment;
  salience: number;
  constructor(data) {
    this.name = data.name;
    this.type = data.type;
    this.metadata = data.metadata ? new NLPMetadata(data.metadata) : null;
    this.sentiment = data.sentiment ? new NLPSentiment(data.sentiment) : null;
    this.salience = data.salience;
  }
}

class NLPMetadata {
  wikipedia: string;
  mid: string;
  constructor(data) {
    this.wikipedia = data.wikipedia_url;
    this.mid = data.mid;
  }
}

class NLPSentiment {
  magnitude: number;
  score: number;
  constructor(data) {
    this.magnitude = data.magnitude;
    this.score = data.score;
  }
}
