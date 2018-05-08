import * as fs from "fs";
import { promisify } from "util";
import { createCapture } from "../../capture/services/capture";
import { User } from "../../db/models/user";
import { createIfAbsent } from "../../db/services/evernote-note";
import { getAuthenticatedUser } from "../../filters/request-context";
import { EvernoteUpload } from "../models/evernote-upload";
import { parseEvernoteHtml } from "./evernote-html-parser";
import { save as saveFile } from "./file-db";

const readFileAsync = promisify(fs.readFile);

export function importEvernoteNote(file): Promise<boolean> {
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
    return saveFile(note.id, file).then(() => {
      return createIfAbsent(user.id, note).then(() => {
        return createEvernoteCaptures(note).then(() => true);
      });
    });
  });
}

function createEvernoteCaptures(note: EvernoteUpload): Promise<void> {
  const batchCreates = Promise.all(
    note.contents.map(content => {
      return createCapture(content, note.id, "HTML");
    })
  );
  return batchCreates.then(() => null);
}
