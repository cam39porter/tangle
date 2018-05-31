import { Relationship } from "../../db/neo4j/relationship";

export class CaptureRelation {
  public captureId: string;
  public relationshipType: Relationship;
  constructor(captureId: string, relationshipType: Relationship) {
    this.captureId = captureId;
    this.relationshipType = relationshipType;
  }
}
