import { User } from "../../db/models/user";
import { upsert as upsertLink } from "../../db/services/link";
import { createRelationship } from "../../db/services/relationship";
import { upsert as upsertTag } from "../../db/services/tag";

import {
  createCaptureNode,
  editCaptureNodeAndDeleteRelationships,
  deleteCaptureNode
} from "../../db/services/capture";
import { getNLPResponse } from "../../nlp/services/nlp";
import * as cheerio from "cheerio";

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
import { CaptureUrn } from "../../urn/capture-urn";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { SessionUrn } from "../../urn/session-urn";

export function dismissCaptureRelation(
  fromId: string,
  toId: string
): Promise<boolean> {
  return createRelationship(
    getAuthenticatedUser().urn,
    fromId,
    CAPTURE_LABEL,
    toId,
    CAPTURE_LABEL,
    DISMISSED_RELATION_RELATIONSHIP
  ).then(() => true);
}

export function deleteCapture(urn: CaptureUrn): Promise<boolean> {
  const userId = getAuthenticatedUser().urn;
  return deleteCaptureNode(userId, urn);
}

export function editCapture(urn: CaptureUrn, body: string): Promise<GraphNode> {
  const userId = getAuthenticatedUser().urn;
  const plainText = parseHtml(body);
  return editCaptureNodeAndDeleteRelationships(
    userId,
    urn,
    plainText,
    body
  ).then(capture =>
    createRelations(urn, plainText).then(() => formatCapture(capture))
  );
}

export function createCapture(
  body: string,
  parentUrn: EvernoteNoteUrn | SessionUrn | null,
  captureRelation: CaptureRelation
): Promise<GraphNode> {
  const user: User = getAuthenticatedUser();
  if (
    captureRelation &&
    captureRelation.relationshipType.name === PREVIOUS_RELATIONSHIP.name &&
    !parentUrn
  ) {
    throw new GraphQLError(
      "Malformed request. SessionId is required if captureRelation is present and of type PREVIOUS"
    );
  }
  const plainText = parseHtml(body);
  return createCaptureNode(user.urn, plainText, body, parentUrn)
    .then((capture: Capture) => {
      if (captureRelation) {
        return createRelationship(
          user.urn,
          capture.urn.toRaw(),
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
      return createRelations(capture.urn, plainText).then(() =>
        formatCapture(capture)
      );
    });
}

function parseHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.root().text();
}

function createRelations(
  captureUrn: CaptureUrn,
  body: string
): Promise<boolean> {
  const promises = [
    createTags(captureUrn, body),
    createLinks(captureUrn, body),
    createEntities(captureUrn, body)
  ];
  return Promise.all(promises)
    .then(() => true)
    .catch(err => {
      throw err;
    });
}

function createTags(captureUrn: CaptureUrn, body: string): Promise<boolean> {
  const user: User = getAuthenticatedUser();
  return Promise.all(
    parseTags(body).map(tag =>
      upsertTag(user.urn, tag, captureUrn, CAPTURE_LABEL)
    )
  ).then(() => true);
}

function createLinks(captureUrn: CaptureUrn, body: string): Promise<boolean> {
  const user: User = getAuthenticatedUser();
  return Promise.all(
    parseLinks(body).map(link => upsertLink(user.urn, link, captureUrn))
  ).then(() => true);
}

function createEntities(
  captureUrn: CaptureUrn,
  body: string
): Promise<boolean> {
  return getNLPResponse(stripTags(body)).then(nlp => {
    const user: User = getAuthenticatedUser();
    return Promise.all(
      nlp.entities.map(entity =>
        upsertEntity(
          user.urn,
          entity.name,
          entity.type,
          entity.salience,
          captureUrn
        )
      )
    ).then(() => true);
  });
}
