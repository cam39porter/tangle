import {
  PageInfo,
  NLPEntityResponse,
  SearchResults,
  Graph,
  GraphNode,
  Edge,
  NLPEntity,
  User
} from "../models";

import { getNLPResponse } from "../services/nlp";
import {
  executeQuery,
  createCaptureNode,
  createTagNodeWithEdge,
  createEntityNodeWithEdge,
  archiveCaptureNode,
  editCaptureNode,
  createSession,
  createUser,
  createLinkNodeWithEdge
} from "../db/db";
import { parseTags, stripTags, parseLinks } from "../helpers/capture-parser";
import * as moment from "moment";
import { getAuthenticatedUser } from "../services/request-context";
import { toEntityUrn, toUserUrn, getUrnType } from "../helpers/urn-helpers";

const dedupe = require("dedupe");

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
    return nlpCreates.then(nlpCreateResults => {
      const tagCreates = Promise.all(
        parseTags(body).map(tag => createTagNodeWithEdge(tag, captureId))
      );
      return tagCreates.then(tagCreateResults => {
        const linkCreates = Promise.all(
          parseLinks(body).map(link => createLinkNodeWithEdge(link, captureId))
        );
        return linkCreates.then(linkCreateResults => true);
      });
    });
  });
}
