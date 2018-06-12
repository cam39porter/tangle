import {
  create as createSession,
  edit as editSession,
  deleteSession
} from "./services/session";
import { GraphNode } from "../surface/models/graph-node";
import {
  createCapture,
  editCapture,
  dismissCaptureRelation,
  archiveCapture
} from "./services/capture";
import { CaptureUrn } from "../urn/capture-urn";
import { SessionUrn } from "../urn/session-urn";

export default {
  Mutation: {
    // @ts-ignore
    archiveCapture(parent, { id }, context, info): Promise<GraphNode> {
      return archiveCapture(CaptureUrn.fromRaw(id));
    },
    // @ts-ignore
    editCapture(parent, { id, body }, context, info): Promise<GraphNode> {
      return editCapture(CaptureUrn.fromRaw(id), body);
    },
    // @ts-ignore
    createCapture(
      // @ts-ignore
      parent,
      // @ts-ignore
      { body, sessionId, captureRelation },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<GraphNode> {
      return createCapture(
        body,
        (sessionId && SessionUrn.fromRaw(sessionId)) || null,
        "HTML",
        captureRelation
      );
    },
    createSession(
      // @ts-ignore
      parent,
      // @ts-ignore
      { title, firstCaptureId, tags },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<GraphNode> {
      return createSession(
        title,
        firstCaptureId ? CaptureUrn.fromRaw(firstCaptureId) : null,
        tags
      );
    },
    editSession(
      // @ts-ignore
      parent,
      // @ts-ignore
      { id, title, tags },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<GraphNode> {
      return editSession(SessionUrn.fromRaw(id), title, tags);
    },
    // @ts-ignore
    deleteSession(parent, { id }, context, info): Promise<boolean> {
      return deleteSession(SessionUrn.fromRaw(id));
    },

    // @ts-ignore
    dismissCaptureRelation(
      // @ts-ignore
      parent,
      // @ts-ignore
      { fromId, toId },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<boolean> {
      return dismissCaptureRelation(fromId, toId);
    }
  }
};
