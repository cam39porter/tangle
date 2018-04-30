import { User } from "../db/models/user";
import { upsert as upsertTag } from "../db/services/tag";
import { GraphNode } from "../models/graph-node";

import {
  createCaptureNode,
  createEntityNodeWithEdge,
  createLinkNodeWithEdge,
  editCaptureNode
} from "../db/db";
import { getNLPResponse } from "../nlp/services/nlp";

import { parseLinks, parseTags, stripTags } from "../helpers/capture-parser";
import { getAuthenticatedUser } from "../services/request-context";

export function editCapture(id: string, body: string) {
  const userId = getAuthenticatedUser().id;
  return editCaptureNode(userId, id, body).then(() =>
    createRelations(id, body, "PLAIN_TEXT")
  );
}

export function createCapture(
  body: string,
  parentId: string,
  contentType: string = "PLAIN_TEXT"
): Promise<boolean> {
  const user: User = getAuthenticatedUser();
  return createCaptureNode(user, body, parentId).then(
    (captureNode: GraphNode) =>
      createRelations(captureNode.id, body, contentType)
  );
}

function createRelations(
  captureId: string,
  body: string,
  contentType: string
): Promise<boolean> {
  return getNLPResponse(stripTags(body), contentType).then(nlp => {
    const nlpCreates = Promise.all(
      nlp.entities.map(entity => createEntityNodeWithEdge(captureId, entity))
    );
    return nlpCreates.then(() => {
      const tagCreates = Promise.all(
        parseTags(body).map(tag => upsertTag(tag, captureId))
      );
      return tagCreates.then(() => {
        const linkCreates = Promise.all(
          parseLinks(body).map(link => createLinkNodeWithEdge(link, captureId))
        );
        return linkCreates.then(() => true);
      });
    });
  });
}
