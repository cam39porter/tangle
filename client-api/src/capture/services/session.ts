import { Session } from "../../db/models/session";
import {
  create as createSession,
  edit as editSession
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
export function create(
  title: string,
  firstCaptureUrn: CaptureUrn,
  tags: string[]
): Promise<GraphNode> {
  const userId = getAuthenticatedUser().id;
  return createSession(userId, title).then((session: Session) => {
    let relationshipPromise;
    if (firstCaptureUrn) {
      relationshipPromise = createRelationship(
        userId,
        session.id,
        SESSION_LABEL,
        firstCaptureUrn.toRaw(),
        CAPTURE_LABEL,
        INCLUDES_RELATIONSHIP
      );
    } else {
      relationshipPromise = Promise.resolve(null);
    }
    const tagUpserts = createTags(userId, session.id, tags);
    return Promise.all([relationshipPromise, tagUpserts]).then(() => {
      return new GraphNode(session.id, "Session", session.title, null);
    });
  });
}

export function edit(
  id: string,
  title: string,
  tags: string[]
): Promise<GraphNode> {
  const userId = getAuthenticatedUser().id;
  return editSession(userId, id, title).then((session: Session) => {
    return deleteTags(userId, session.id).then(() =>
      createTags(userId, session.id, tags).then(
        () => new GraphNode(session.id, "Session", session.title, null)
      )
    );
  });
}

function deleteTags(userId: string, sessionId: string): Promise<void> {
  return getTags(userId, sessionId, "Session")
    .then(tags => {
      return Promise.all(
        tags.map(tag =>
          deleteRelationship(
            userId,
            sessionId,
            SESSION_LABEL,
            tag.id,
            TAG_LABEL,
            TAGGED_WITH_RELATIONSHIP
          )
        )
      );
    })
    .then(() => null);
}

function createTags(
  userId: string,
  sessionId: string,
  tags: string[]
): Promise<void> {
  if (tags && tags.length !== 0) {
    return Promise.all(
      tags.map(tag => upsertTag(userId, tag, sessionId, "Session"))
    ).then(() => null);
  } else {
    return Promise.resolve(null);
  }
}
