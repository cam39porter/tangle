import { createCapture } from "../../capture/services/capture";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { SessionUrn } from "../../urn/session-urn";
import {
  getCapturesByRelatedNode,
  deleteCaptureNode
} from "../../db/services/capture";
import { chunkHtml } from "../../util/parsing/parse-chunks";
import { UserUrn } from "../../urn/user-urn";

export function updateCaptures(
  userUrn: UserUrn,
  parentUrn: SessionUrn | EvernoteNoteUrn,
  body: string,
  previouslyCreated: number
): Promise<void> {
  const chunks = chunkHtml(body);
  return deleteCaptures(userUrn, parentUrn).then(() => {
    const batchCreates = chunks.reduce((promise, chunk) => {
      return promise.then(() =>
        createCapture(
          userUrn,
          chunk.html,
          parentUrn,
          null,
          previouslyCreated
        ).then(() => null)
      );
    }, Promise.resolve());
    return batchCreates.then(() => null);
  });
}

export function deleteCaptures(
  userUrn: UserUrn,
  parentUrn: SessionUrn | EvernoteNoteUrn
): Promise<void> {
  return getCapturesByRelatedNode(userUrn, parentUrn)
    .then(captures => {
      return Promise.all(
        captures.map(capture => deleteCaptureNode(userUrn, capture.urn))
      );
    })
    .then(() => null);
}
