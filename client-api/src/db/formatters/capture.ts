import { Capture } from "../models/capture";
import { Node } from "neo4j-driver/types/v1";
import { CaptureUrn } from "../../urn/capture-urn";
import { formatBasicSession } from "./session";

export function formatBasicCapture(record: Node): Capture {
  return buildFromProps(record.properties);
}

export function formatCaptureWithSessions(
  captureRecord: Node,
  sessionRecords: Node[],
  authorName?: string
): Capture {
  const capture = buildFromProps(captureRecord.properties);
  capture.authorName = authorName || null;
  const basicSessions = sessionRecords.map(sessionRecord =>
    formatBasicSession(sessionRecord)
  );
  capture.parents = basicSessions;
  return capture;
}

export function buildFromProps(props: object): Capture {
  return new Capture(
    CaptureUrn.fromRaw(props["id"]),
    props["body"],
    props["created"],
    props["lastModified"] || props["created"]
  );
}
