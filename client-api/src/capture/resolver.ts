import { Session } from "../db/models/session";
import { archiveCaptureNode } from "../db/services/capture";
import { create as createSession } from "../db/services/session";
import { getAuthenticatedUser } from "../filters/request-context";
import { Graph } from "../surface/models/graph";
import { GraphNode } from "../surface/models/graph-node";
import { getAllByUseCase } from "../surface/services/capture";
import { createCapture, editCapture } from "./services/capture";

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
    createCapture(parent, { body, sessionId }, context, info): Promise<Graph> {
      return createCapture(body, sessionId).then(() =>
        getAllByUseCase("CAPTURED_TODAY", null).then(results => results.graph)
      );
    },
    // @ts-ignore
    createSession(parent, { title }, context, info): Promise<GraphNode> {
      const userId = getAuthenticatedUser().id;
      return createSession(userId, title).then((session: Session) => {
        return new GraphNode(session.id, "Session", session.title, null);
      });
    }
  }
};
