import { save } from "./import-db";
import { v4 as uuidv4 } from "uuid/v4";
import { SessionUrn } from "../../urn/session-urn";
import { enqueue } from "./queue";
import { getRequestContext } from "../../filters/request-context";
export function importEvernoteNoteUpload(file): Promise<void> {
  const uuid = uuidv4();
  const noteUrn = new SessionUrn(uuid);
  const userUrn = getRequestContext().user.urn;
  return save(noteUrn, file)
    .then(() => enqueue(userUrn, noteUrn))
    .then(() => null);
}
