import * as Storage from "@google-cloud/storage";
import { getAuthenticatedUser } from "../../filters/request-context";
import { EvernoteNoteUrn } from "../../urn/evernote-note-urn";
import { Logger } from "../../util/logging/logger";

const LOGGER = new Logger("src/upload/services/file-db.ts");

const storage = Storage();
const bucketName =
  process.env.NODE_ENV === "production"
    ? "tangle-prod-bulk-import"
    : "tangle-dev-bulk-import";

export function save(urn: EvernoteNoteUrn, file): Promise<void> {
  const userId = getAuthenticatedUser().urn;
  const dest = `users/${userId.toRaw()}/${urn.toRaw()}`;
  return writeToDb(dest, file);
}

function writeToDb(dest: string, file): Promise<void> {
  return storage
    .bucket(bucketName)
    .upload(`${file.path}`, { destination: dest })
    .then(() => {
      LOGGER.info(`${file} uploaded to ${bucketName}.`);
    })
    .catch(err => {
      LOGGER.error("ERROR:", err);
    });
}
