import * as fs from "fs";
import { promisify } from "util";
import { createCapture } from "../../capture/services/capture";
import { User } from "../../db/models/user";
import {
  deleteCaptureNode,
  getCapturesByRelatedNode
} from "../../db/services/capture";
import { create, deleteNote } from "../../db/services/evernote-note";
import {
  getAuthenticatedUser,
  getRequestContext
} from "../../filters/request-context";
import { EvernoteUpload } from "../models/evernote-upload";
import { parseEvernoteHtml } from "./evernote-html-parser";
import { saveOverwrite, saveSafely } from "./file-db";
import { UserUrn } from "../../urn/user-urn";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { v4 as uuidv4 } from "uuid/v4";
import { Logger } from "../../util/logging/logger";

const LOGGER = new Logger("src/upload/services/evernote-import.ts");
const readFileAsync = promisify(fs.readFile);

export function importEvernoteNoteUpload(file): Promise<void> {
  return readFileAsync(file.path).then(data => {
    const user: User = getAuthenticatedUser();
    let note: EvernoteUpload = null;
    try {
      note = parseEvernoteHtml(data);
    } catch (err) {
      LOGGER.error(getRequestContext(), `Could not parse html, error ${err}`);
      throw new Error(
        "Could not parse html. Please email cole@usetangle.com with your issue"
      );
    }
    const uuid = uuidv4();
    const noteUrn = new EvernoteNoteUrn(uuid);
    return (
      saveSafely(noteUrn, file)
        .then(() => createEvernoteNote(user.urn, noteUrn, note))
        // TODO cmccrack require overwrite param from frontend to do this
        .catch(() => {
          return saveOverwrite(noteUrn, file).then(() =>
            deleteEvernoteNote(noteUrn).then(() =>
              createEvernoteNote(user.urn, noteUrn, note)
            )
          );
        })
    );
  });
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
  noteUrn: EvernoteNoteUrn,
  note: EvernoteUpload
): Promise<void> {
  return create(userId, noteUrn, note).then(() => {
    return createEvernoteCaptures(noteUrn, note).then(() => null);
  });
}

function createEvernoteCaptures(
  noteUrn: EvernoteNoteUrn,
  note: EvernoteUpload
): Promise<void> {
  const batchCreates = Promise.all(
    note.contents.map(content => {
      return createCapture(content, noteUrn, null);
    })
  );
  return batchCreates.then(() => null);
}
