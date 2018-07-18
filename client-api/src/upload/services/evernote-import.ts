import { save } from "./import-db";
import { v4 as uuidv4 } from "uuid/v4";
import { SessionUrn } from "../../urn/session-urn";
import { enqueue } from "./queue";
import { getRequestContext } from "../../filters/request-context";
import { hasAvailableStorage } from "../../surface/services/settings";
import { ExceededStorageAllowanceError } from "../../util/exceptions/exceeded-storage-allowance-error";

export function importEvernoteNoteUpload(file): Promise<void> {
  return hasAvailableStorage().then(hasAvailableStorageBool => {
    if (!hasAvailableStorageBool) {
      throw new ExceededStorageAllowanceError(
        "User has exceeded allowed storage, please delete sessions in order to add more"
      );
    } else {
      const uuid = uuidv4();
      const noteUrn = new SessionUrn(uuid);
      const userUrn = getRequestContext().user.urn;
      return save(noteUrn, file)
        .then(() => enqueue(userUrn, noteUrn))
        .then(() => null);
    }
  });
}
