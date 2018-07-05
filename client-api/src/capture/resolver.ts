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
  deleteCapture
} from "./services/capture";
import { CaptureUrn } from "../urn/capture-urn";
import { SessionUrn } from "../urn/session-urn";
import * as xss from "xss";
import { CaptureRelation } from "./models/capture-relation";
import { Relationship } from "../db/neo4j/relationship";

const xssOptions = { whiteList: xss.whiteList };
const captureXSS = new xss.FilterXSS(xssOptions);
export default {
  Mutation: {
    // @ts-ignore
    deleteCapture(parent, { id }, context, info): Promise<boolean> {
      return deleteCapture(CaptureUrn.fromRaw(id));
    },
    // @ts-ignore
    editCapture(parent, { id, body }, context, info): Promise<GraphNode> {
      return editCapture(CaptureUrn.fromRaw(id), captureXSS.process(body));
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
      const relation = captureRelation
        ? new CaptureRelation(
            captureRelation.captureId,
            new Relationship(captureRelation.relationshipType)
          )
        : null;
      return createCapture(
        captureXSS.process(body),
        (sessionId && SessionUrn.fromRaw(sessionId)) || null,
        relation
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
        captureXSS.process(title),
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
