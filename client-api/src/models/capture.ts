export class Capture {
  id: string;
  body: string;
  created: string;
  constructor(data) {
    this.id = data.ID;
    this.body = data.body;
    this.created = data.created;
  }
}
