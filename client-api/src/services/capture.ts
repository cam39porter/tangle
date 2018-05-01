import { User } from "../db/models/user";
import { upsert as upsertLink } from "../db/services/link";
import { upsert as upsertTag } from "../db/services/tag";

import {
  createCaptureNode,
  editCaptureNodeAndDeleteRelationships
} from "../db/services/capture";
import { getNLPResponse } from "../nlp/services/nlp";

import { Capture } from "../db/models/capture";
import { upsertEntity } from "../db/services/entity";
import { parseLinks, parseTags, stripTags } from "../helpers/capture-parser";
import { getAuthenticatedUser } from "../services/request-context";

export function editCapture(id: string, body: string) {
  const userId = getAuthenticatedUser().id;
  return editCaptureNodeAndDeleteRelationships(userId, id, body).then(() =>
    createRelations(id, body, "PLAIN_TEXT")
  );
}

export function createCapture(
  body: string,
  parentId: string,
  contentType: string = "PLAIN_TEXT"
): Promise<boolean> {
  const user: User = getAuthenticatedUser();
  return createCaptureNode(user.id, body, parentId).then((capture: Capture) =>
    createRelations(capture.id, body, contentType)
  );
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
  return Promise.all(
    parseTags(body).map(tag => upsertTag(tag, captureId))
  ).then(() => true);
}

function createLinks(captureId: string, body: string): Promise<boolean> {
  return Promise.all(
    parseLinks(body).map(link => upsertLink(link, captureId))
  ).then(() => true);
}

function createEntities(
  captureId: string,
  body: string,
  contentType: string
): Promise<boolean> {
  return getNLPResponse(stripTags(body), contentType).then(nlp => {
    return Promise.all(
      nlp.entities.map(entity =>
        upsertEntity(entity.name, entity.type, entity.salience, captureId)
      )
    ).then(() => true);
  });
}
