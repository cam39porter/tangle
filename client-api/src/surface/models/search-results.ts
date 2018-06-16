import { Capture } from "../../db/models/capture";
import { Session } from "../../db/models/session";
import { CollectionResult } from "./collection-result";

export class SearchResults {
  public captures: CollectionResult<Capture>;
  public sessions: CollectionResult<Session>;
  constructor(
    captures: CollectionResult<Capture>,
    sessions: CollectionResult<Session>
  ) {
    this.captures = captures;
    this.sessions = sessions;
  }
}
