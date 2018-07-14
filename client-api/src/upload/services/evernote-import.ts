import { User } from "../../db/models/user";
import {
  deleteCaptureNode,
  getCapturesByRelatedNode
} from "../../db/services/capture";
import { create } from "../../db/services/session";
import { deleteNote } from "../../db/services/evernote-note";
import { getAuthenticatedUser } from "../../filters/request-context";
import { EvernoteUpload } from "../models/evernote-upload";
import { parseEvernoteHtml } from "./evernote-html-parser";
import { save } from "./file-db";
import { UserUrn } from "../../urn/user-urn";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { v4 as uuidv4 } from "uuid/v4";
import { Logger } from "../../util/logging/logger";
import { updateCaptures } from "../../chunk/services/chunk";
import { SessionUrn } from "../../urn/session-urn";

const LOGGER = new Logger("src/upload/services/evernote-import.ts");

export function importEvernoteNoteUpload(file): Promise<void> {
  const user: User = getAuthenticatedUser();
  let note: EvernoteUpload = null;
  try {
    note = parseEvernoteHtml(file.buffer);
  } catch (err) {
    LOGGER.error(`Could not parse html, error ${err}`);
    throw new Error(
      "Could not parse html. Please email cole@usetangle.com with your issue"
    );
  }
  const uuid = uuidv4();
  const noteUrn = new SessionUrn(uuid);

  return save(noteUrn, file).then(() =>
    createEvernoteNote(user.urn, noteUrn, note)
  );
}

export function deleteEvernoteNote(noteUrn: EvernoteNoteUrn): Promise<void> {
  const userId = getAuthenticatedUser().urn;
  const deleteCaptures = getCapturesByRelatedNode(userId, noteUrn).then(
    captures => {
      return Promise.all(
        captures.map(capture => deleteCaptureNode(userId, capture.urn))
      );
    }
  );
  return deleteCaptures.then(() => {
    deleteNote(userId, noteUrn);
  });
}

function createEvernoteNote(
  userId: UserUrn,
  noteUrn: SessionUrn,
  note: EvernoteUpload
): Promise<void> {
  return create(
    noteUrn,
    userId,
    note.title,
    note.body,
    note.created,
    true
  ).then(() => {
    return updateCaptures(noteUrn, note.body, note.created).then(() => null);
  });
}
