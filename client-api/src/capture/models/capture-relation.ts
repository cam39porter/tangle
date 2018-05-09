export class CaptureRelation {
  public captureId: string;
  public relationshipType: string;
  constructor(captureId: string, relationshipType: string) {
    this.captureId = captureId;
    this.relationshipType = relationshipType;
  }
}
