import { Capture } from "../models/capture";
import { Node } from "neo4j-driver/types/v1";
import { CaptureUrn } from "../../urn/capture-urn";
import { formatBasicSession } from "./session";

export function formatBasicCapture(record: Node): Capture {
  return buildFromNeo(record.properties);
}

export function formatCaptureWithSessions(
  captureRecord: Node,
  sessionRecords: Node[]
): Capture {
  const capture = buildFromNeo(captureRecord.properties);
  const basicSessions = sessionRecords.map(sessionRecord =>
    formatBasicSession(sessionRecord)
  );
  capture.parents = basicSessions;
  return capture;
}

export function buildFromNeo(props: object): Capture {
  return new Capture(
    CaptureUrn.fromRaw(props["id"]),
    props["body"],
    props["created"]
  );
}
