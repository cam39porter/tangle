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

import { Capture } from "../../db/models/capture";
import { upsertEntity } from "../../db/services/entity";
import { getAuthenticatedUser } from "../../filters/request-context";
import { parseLinks, parseTags, stripTags } from "../../helpers/capture-parser";
import { CAPTURE_LABEL, SESSION_LABEL } from "../../db/helpers/labels";
import {
  DISMISSED_RELATION_RELATIONSHIP,
  PREVIOUS_RELATIONSHIP
} from "../../db/helpers/relationships";
import { formatCapture } from "../../surface/formatters/graph-node";
import { GraphNode } from "../../surface/models/graph-node";
import { CaptureUrn } from "../../urn/capture-urn";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { SessionUrn } from "../../urn/session-urn";
import * as htmltotext from "html-to-text";
import { Urn } from "../../urn/urn";
import { UserUrn } from "../../urn/user-urn";
import { touchLastModified } from "../../db/services/session";

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
    createRelations(urn, plainText).then(() => formatCapture(capture, true))
  );
}

export function createCapture(
  body: string,
  parentUrn: EvernoteNoteUrn | SessionUrn | null,
  previousUrn: Urn | null
): Promise<GraphNode> {
  const user: User = getAuthenticatedUser();
  const plainText = parseHtml(body);
  return createCaptureNode(user.urn, plainText, body, parentUrn).then(
    (capture: Capture) => {
      return Promise.all([
        updateParentModified(user.urn, parentUrn),
        createPreviousRelationship(user.urn, capture.urn, previousUrn),
        createRelations(capture.urn, plainText)
      ]).then(() => formatCapture(capture, true));
    }
  );
}

function updateParentModified(
  userUrn: UserUrn,
  parentUrn: SessionUrn | EvernoteNoteUrn | null
): Promise<boolean> {
  if (parentUrn && SessionUrn.isSessionUrn(parentUrn)) {
    // touch
    return Promise.resolve(touchLastModified(userUrn, parentUrn)).then(
      () => true
    );
  } else {
    return Promise.resolve(true);
  }
}

function createPreviousRelationship(
  userUrn: UserUrn,
  captureUrn: CaptureUrn,
  previousUrn: Urn | null
): Promise<boolean> {
  if (previousUrn) {
    const destLabel = CaptureUrn.isCaptureUrn(previousUrn)
      ? CAPTURE_LABEL
      : SESSION_LABEL;
    return createRelationship(
      userUrn,
      captureUrn.toRaw(),
      CAPTURE_LABEL,
      previousUrn.toRaw(),
      destLabel,
      PREVIOUS_RELATIONSHIP
    ).then(() => true);
  } else {
    return Promise.resolve(true);
  }
}

function parseHtml(html: string): string {
  return htmltotext.fromString(html, {
    preserveNewlines: true,
    singleNewLineParagraphs: true
  });
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
