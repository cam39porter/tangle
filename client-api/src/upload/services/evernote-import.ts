import * as fs from "fs";
import { promisify } from "util";
import { createCapture } from "../../capture/services/capture";
import { User } from "../../db/models/user";
import {
  archiveCaptureNode,
  getCapturesByRelatedNode
} from "../../db/services/capture";
import { create, deleteNote } from "../../db/services/evernote-note";
import { getAuthenticatedUser } from "../../filters/request-context";
import { EvernoteUpload } from "../models/evernote-upload";
import { parseEvernoteHtml } from "./evernote-html-parser";
import { saveOverwrite, saveSafely } from "./file-db";
import { Capture } from "../../db/models/capture";

const readFileAsync = promisify(fs.readFile);

export function importEvernoteNoteUpload(file): Promise<void> {
  return readFileAsync(file.path).then(data => {
    const user: User = getAuthenticatedUser();
    let note: EvernoteUpload = null;
    try {
      note = parseEvernoteHtml(user.id, data);
    } catch (err) {
      console.error(err);
      throw new Error(
        "Could not parse html. Please email cole@usetangle.com with your issue"
      );
    }
    return (
      saveSafely(note.id, file)
        .then(() => createEvernoteNote(user.id, note))
        // TODO cmccrack require overwrite param from frontend to do this
        .catch(() => {
          return saveOverwrite(note.id, file).then(() =>
            deleteEvernoteNote(note.id).then(() =>
              createEvernoteNote(user.id, note)
            )
          );
        })
    );
  });
}

export function deleteEvernoteNote(evernoteId: string): Promise<void> {
  const userId = getAuthenticatedUser().id;
  const archiveCaptures = getCapturesByRelatedNode(userId, evernoteId).then(
    nodeAndCaptures => {
      const captures = nodeAndCaptures[1] as Capture[];
      return Promise.all(
        captures.map(capture => archiveCaptureNode(userId, capture.id))
      );
    }
  );
  return archiveCaptures.then(() => {
    deleteNote(userId, evernoteId);
  });
}

function createEvernoteNote(
  userId: string,
  note: EvernoteUpload
): Promise<void> {
  return create(userId, note).then(() => {
    return createEvernoteCaptures(note).then(() => null);
  });
}

function createEvernoteCaptures(note: EvernoteUpload): Promise<void> {
  const batchCreates = Promise.all(
    note.contents.map(content => {
      return createCapture(content, note.id, "HTML", null);
    })
  );
  return batchCreates.then(() => null);
}
