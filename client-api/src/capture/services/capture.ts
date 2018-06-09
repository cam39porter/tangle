import { User } from "../../db/models/user";
import { upsert as upsertLink } from "../../db/services/link";
import { createRelationship } from "../../db/services/relationship";
import { upsert as upsertTag } from "../../db/services/tag";

import {
  createCaptureNode,
  editCaptureNodeAndDeleteRelationships,
  archiveCaptureNode
} from "../../db/services/capture";
import { getNLPResponse } from "../../nlp/services/nlp";

import { GraphQLError } from "graphql";
import { Capture } from "../../db/models/capture";
import { upsertEntity } from "../../db/services/entity";
import { getAuthenticatedUser } from "../../filters/request-context";
import { parseLinks, parseTags, stripTags } from "../../helpers/capture-parser";
import { CaptureRelation } from "../models/capture-relation";
import { CAPTURE_LABEL } from "../../db/helpers/labels";
import {
  DISMISSED_RELATION_RELATIONSHIP,
  PREVIOUS_RELATIONSHIP
} from "../../db/helpers/relationships";
import { formatCapture } from "../../surface/formatters/graph-node";
import { GraphNode } from "../../surface/models/graph-node";

export function dismissCaptureRelation(
  fromId: string,
  toId: string
): Promise<boolean> {
  return createRelationship(
    getAuthenticatedUser().id,
    fromId,
    CAPTURE_LABEL,
    toId,
    CAPTURE_LABEL,
    DISMISSED_RELATION_RELATIONSHIP
  ).then(() => true);
}

export function archiveCapture(id: string): Promise<GraphNode> {
  const userId = getAuthenticatedUser().id;
  return archiveCaptureNode(userId, id).then(capture =>
    formatCapture(capture, false)
  );
}

export function editCapture(id: string, body: string): Promise<GraphNode> {
  const userId = getAuthenticatedUser().id;
  return editCaptureNodeAndDeleteRelationships(userId, id, body).then(capture =>
    createRelations(id, body, "HTML").then(() => formatCapture(capture, false))
  );
}

export function createCapture(
  body: string,
  parentId: string,
  contentType: string,
  captureRelation: CaptureRelation
): Promise<GraphNode> {
  const user: User = getAuthenticatedUser();
  if (
    captureRelation &&
    captureRelation.relationshipType.name === PREVIOUS_RELATIONSHIP.name &&
    !parentId
  ) {
    throw new GraphQLError(
      "Malformed request. SessionId is required if captureRelation is present and of type PREVIOUS"
    );
  }
  return createCaptureNode(user.id, body, parentId)
    .then((capture: Capture) => {
      if (captureRelation) {
        return createRelationship(
          user.id,
          capture.id,
          CAPTURE_LABEL,
          captureRelation.captureId,
          CAPTURE_LABEL,
          captureRelation.relationshipType
        ).then(() => capture);
      } else {
        return Promise.resolve(capture);
      }
    })
    .then((capture: Capture) => {
      return createRelations(capture.id, body, contentType).then(() =>
        formatCapture(capture, false)
      );
    });
}

function createRelations(
  captureId: string,
  body: string,
  contentType: string
): Promise<boolean> {
  const promises = [
    createTags(captureId, body),
    createLinks(captureId, body),
    createEntities(captureId, body, contentType)
  ];
  return Promise.all(promises)
    .then(() => true)
    .catch(err => {
      console.log(err);
      throw err;
    });
}

function createTags(captureId: string, body: string): Promise<boolean> {
  const user: User = getAuthenticatedUser();
  return Promise.all(
    parseTags(body).map(tag => upsertTag(user.id, tag, captureId, "Capture"))
  ).then(() => true);
}

function createLinks(captureId: string, body: string): Promise<boolean> {
  const user: User = getAuthenticatedUser();
  return Promise.all(
    parseLinks(body).map(link => upsertLink(user.id, link, captureId))
  ).then(() => true);
}

function createEntities(
  captureId: string,
  body: string,
  contentType: string
): Promise<boolean> {
  return getNLPResponse(stripTags(body), contentType).then(nlp => {
    const user: User = getAuthenticatedUser();
    return Promise.all(
      nlp.entities.map(entity =>
        upsertEntity(
          user.id,
          entity.name,
          entity.type,
          entity.salience,
          captureId
        )
      )
    ).then(() => true);
  });
}
