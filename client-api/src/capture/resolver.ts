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
import { create as createFeedback } from "../db/services/feedback";
import { reportClientError } from "../util/logging/logger";
import { Urn } from "../urn/urn";
import { getRequestContext } from "../filters/request-context";
import { createCapturedLink } from "../db/services/captured-link";

const xssOptions = { whiteList: xss.whiteList };
const captureXSS = new xss.FilterXSS(xssOptions);
export default {
  Mutation: {
    // @ts-ignore
    createCapturedLink(
      // @ts-ignore
      parent,
      // @ts-ignore
      { title, url, content, byline, length },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<string> {
      const userUrn = getRequestContext().loggedInUser.urn;
      return createCapturedLink(
        userUrn,
        captureXSS.process(title),
        captureXSS.process(url),
        captureXSS.process(content),
        captureXSS.process(byline),
        length,
        null
      ).then(capturedLink => capturedLink.urn.toRaw());
    },
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
      { body, sessionId, previousId },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<GraphNode> {
      const userId = getRequestContext().loggedInUser.urn;
      return createCapture(
        userId,
        captureXSS.process(body),
        (sessionId && SessionUrn.fromRaw(sessionId)) || null,
        (previousId && Urn.fromRaw(previousId)) || null,
        null
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
      { id, title, tags, body },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<GraphNode> {
      return editSession(
        SessionUrn.fromRaw(id),
        captureXSS.process(title),
        tags,
        captureXSS.process(body)
      );
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
      // @ts-ignores
      info
    ): Promise<boolean> {
      return dismissCaptureRelation(fromId, toId);
    },
    // @ts-ignore
    sendFeedback(parent, { body }, context, info): Promise<boolean> {
      return createFeedback(body);
    },
    // @ts-ignore
    reportError(
      // @ts-ignore
      parent,
      { message, stacktrace },
      // @ts-ignore
      context,
      // @ts-ignore
      info
    ): Promise<boolean> {
      return reportClientError(message, stacktrace);
    }
  }
};
