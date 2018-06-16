import { CollectionResult } from "./collection-result";
import { CaptureUrn } from "../../urn/capture-urn";
import { SessionUrn } from "../../urn/session-urn";

export class SearchResponse {
  public captures: CollectionResult<CaptureUrn>;
  public sessions: CollectionResult<SessionUrn>;
  constructor(
    captures: CollectionResult<CaptureUrn>,
    sessions: CollectionResult<SessionUrn>
  ) {
    this.captures = captures;
    this.sessions = sessions;
  }
}
