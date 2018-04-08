import { Tag } from "./tag";
import { parseTags } from "../helpers/tag";
export class Capture {
  id: string;
  body: string;
  created: string;
  tags: Tag[];
  constructor(data) {
    this.id = data.id || data.ID;
    this.body = data.body;
    this.created = data.created;
    this.tags = parseTags(data.body).map(tag => new Tag({ name: tag }));
  }
}
