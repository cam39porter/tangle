import { Relationship } from "../neo4j/relationship";

export const TAGGED_WITH_RELATIONSHIP = new Relationship("TAGGED_WITH");
export const DISMISSED_RELATION_RELATIONSHIP = new Relationship(
  "DISMISSED_RELATION"
);
export const PREVIOUS_RELATIONSHIP = new Relationship("PREVIOUS");
export const INCLUDES_RELATIONSHIP = new Relationship("INCLUDES");
export const REFERENCES_RELATIONSHIP = new Relationship("REFERENCES");
