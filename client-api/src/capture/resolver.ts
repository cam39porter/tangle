import { Session } from "../db/models/session";
import { archiveCaptureNode } from "../db/services/capture";
import {
  create as createSession,
  edit as editSession
} from "./services/session";
import { getAuthenticatedUser } from "../filters/request-context";
import { Graph } from "../surface/models/graph";
import { GraphNode } from "../surface/models/graph-node";
import { getAllByUseCase } from "../surface/services/graph";
import {
  createCapture,
  editCapture,
  dismissCaptureRelation
} from "./services/capture";

export default {
  Mutation: {
    // @ts-ignore
    archiveCapture(parent, { id }, context, info): Promise<boolean> {
      const userId: string = getAuthenticatedUser().id;
      return archiveCaptureNode(userId, id).then(() => true);
    },
    // @ts-ignore
    editCapture(parent, { id, body }, context, info): Promise<boolean> {
      return editCapture(id, body);
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
    ): Promise<Graph> {
      return createCapture(body, sessionId, "PLAIN_TEXT", captureRelation).then(
        () =>
          getAllByUseCase("CAPTURED_TODAY", null).then(results => results.graph)
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
      return createSession(title, firstCaptureId, tags);
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
      return editSession(id, title, tags);
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
