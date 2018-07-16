import { createCapture } from "../../capture/services/capture";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { SessionUrn } from "../../urn/session-urn";
import { getRequestContext } from "../../filters/request-context";
import {
  getCapturesByRelatedNode,
  deleteCaptureNode
} from "../../db/services/capture";
import { chunkHtml } from "../../util/parsing/parse-chunks";

export function updateCaptures(
  parentUrn: SessionUrn | EvernoteNoteUrn,
  body: string,
  previouslyCreated: number
): Promise<void> {
  const chunks = chunkHtml(body);
  return deleteCaptures(parentUrn).then(() => {
    const batchCreates = chunks.map(chunk =>
      createCapture(chunk.html, parentUrn, null, previouslyCreated)
    );
    return Promise.all(batchCreates).then(() => null);
  });
}

export function deleteCaptures(
  parentUrn: SessionUrn | EvernoteNoteUrn
): Promise<void> {
  const userId = getRequestContext().user.urn;
  return getCapturesByRelatedNode(userId, parentUrn)
    .then(captures => {
      return Promise.all(
        captures.map(capture => deleteCaptureNode(userId, capture.urn))
      );
    })
    .then(() => null);
}
