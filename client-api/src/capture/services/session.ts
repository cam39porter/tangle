import { v4 as uuidv4 } from "uuid/v4";
import { Session } from "../../db/models/session";
import {
  create as createSession,
  edit as editSession,
  deleteSession as deleteDB
} from "../../db/services/session";
import { getAuthenticatedUser } from "../../filters/request-context";
import { GraphNode } from "../../surface/models/graph-node";
import {
  createRelationship,
  deleteRelationship
} from "../../db/services/relationship";
import { upsert as upsertTag, getTags } from "../../db/services/tag";
import {
  CAPTURE_LABEL,
  SESSION_LABEL,
  TAG_LABEL
} from "../../db/helpers/labels";
import {
  INCLUDES_RELATIONSHIP,
  TAGGED_WITH_RELATIONSHIP
} from "../../db/helpers/relationships";
import { CaptureUrn } from "../../urn/capture-urn";
import { formatSession } from "../../surface/formatters/graph-node";
import { SessionUrn } from "../../urn/session-urn";
import { UserUrn } from "../../urn/user-urn";
import { updateCaptures, deleteCaptures } from "../../chunk/services/chunk";

export function create(
  title: string,
  firstCaptureUrn: CaptureUrn,
  tags: string[]
): Promise<GraphNode> {
  const userId = getAuthenticatedUser().urn;
  const uuid = uuidv4();
  const sessionUrn = new SessionUrn(uuid);
  return createSession(sessionUrn, userId, title, null, null).then(
    (session: Session) => {
      let relationshipPromise;
      if (firstCaptureUrn) {
        relationshipPromise = createRelationship(
          userId,
          session.urn.toRaw(),
          SESSION_LABEL,
          firstCaptureUrn.toRaw(),
          CAPTURE_LABEL,
          INCLUDES_RELATIONSHIP
        );
      } else {
        relationshipPromise = Promise.resolve(null);
      }
      const tagUpserts = createTags(userId, session.urn, tags);
      return Promise.all([relationshipPromise, tagUpserts]).then(() => {
        return formatSession(session);
      });
    }
  );
}

export function edit(
  urn: SessionUrn,
  title: string,
  tags: string[],
  body: string
): Promise<GraphNode> {
  const userId = getAuthenticatedUser().urn;
  return editSession(userId, urn, title, body).then((session: Session) => {
    const updateTags = deleteTags(userId, session.urn).then(() =>
      createTags(userId, session.urn, tags).then(() => formatSession(session))
    );
    if (body) {
      return Promise.all([
        updateTags,
        updateCaptures(userId, session.urn, body, session.created)
      ]).then(both => both[0]);
    } else {
      return updateTags;
    }
  });
}

export function deleteSession(urn: SessionUrn): Promise<boolean> {
  const userId = getAuthenticatedUser().urn;
  return deleteCaptures(userId, urn).then(() => deleteDB(userId, urn));
}

function deleteTags(userId: UserUrn, sessionId: SessionUrn): Promise<void> {
  return getTags(userId, sessionId.toRaw(), SESSION_LABEL.name)
    .then(tags => {
      return Promise.all(
        tags.map(tag =>
          deleteRelationship(
            userId,
            sessionId.toRaw(),
            SESSION_LABEL,
            tag.urn.toRaw(),
            TAG_LABEL,
            TAGGED_WITH_RELATIONSHIP
          )
        )
      );
    })
    .then(() => null);
}

function createTags(
  userId: UserUrn,
  sessionId: SessionUrn,
  tags: string[]
): Promise<void> {
  if (tags && tags.length !== 0) {
    return Promise.all(
      tags.map(tag => upsertTag(userId, tag, sessionId, SESSION_LABEL))
    ).then(() => null);
  } else {
    return Promise.resolve(null);
  }
}
