import { createCapture } from "../../capture/services/capture";
import { User } from "../../db/models/user";
import { createIfAbsent } from "../../db/services/evernote-note";
import { getAuthenticatedUser } from "../../filters/request-context";
import { EvernoteUpload } from "../models/evernote-upload";
import { parseEvernoteHtml } from "./evernote-html-parser";
// import { save as saveFile } from "./file-db";

export function importEvernoteNote(data): Promise<boolean> {
  const note: EvernoteUpload = parseEvernoteHtml(data);
  const user: User = getAuthenticatedUser();
  // return saveFile(data).then(() => {
  return createEvernoteNode(user.id, note).then(() => {
    return createEvernoteCaptures(note).then(() => true);
  });
  // });
}

function createEvernoteCaptures(note: EvernoteUpload): Promise<void> {
  const batchCreates = Promise.all(
    note.contents.map(content => {
      return createCapture(content, note.id, "HTML");
    })
  );
  return batchCreates.then(() => null);
}

function createEvernoteNode(
  userId: string,
  note: EvernoteUpload
): Promise<boolean> {
  return createIfAbsent(userId, note).then(() => true);
}
