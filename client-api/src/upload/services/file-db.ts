import * as Storage from "@google-cloud/storage";
import {
  getAuthenticatedUser,
  getRequestContext
} from "../../filters/request-context";
import { ConflictError } from "../../util/exceptions/confict-error";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { Logger } from "../../util/logging/logger";

const LOGGER = new Logger("src/upload/services/file-db.ts");

const storage = Storage();
const bucketName =
  process.env.NODE_ENV === "production"
    ? "tangle-prod-bulk-import"
    : "tangle-dev-bulk-import";

export function saveOverwrite(urn: EvernoteNoteUrn, file): Promise<void> {
  const userId = getAuthenticatedUser().urn;
  const dest = `users/${userId.toRaw()}/${urn}`;
  return writeToDb(dest, file);
}

export function saveSafely(urn: EvernoteNoteUrn, file): Promise<void> {
  const userId = getAuthenticatedUser().urn;
  const dest = `users/${userId.toRaw()}/${urn.toRaw()}`;
  return storage
    .bucket(bucketName)
    .getFiles({ prefix: dest })
    .then(results => {
      if (results[0].length === 0) {
        writeToDb(dest, file);
      } else {
        throw new ConflictError(
          "A resource with this path has already been uploaded"
        );
      }
    });
}

function writeToDb(dest: string, file): Promise<void> {
  return storage
    .bucket(bucketName)
    .upload(`${file.path}`, { destination: dest })
    .then(() => {
      LOGGER.info(getRequestContext(), `${file} uploaded to ${bucketName}.`);
    })
    .catch(err => {
      LOGGER.error(getRequestContext(), "ERROR:", err);
    });
}
