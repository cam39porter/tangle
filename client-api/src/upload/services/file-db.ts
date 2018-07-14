import * as Storage from "@google-cloud/storage";
import { getAuthenticatedUser } from "../../filters/request-context";
import { Logger } from "../../util/logging/logger";
import { SessionUrn } from "../../urn/session-urn";

const LOGGER = new Logger("src/upload/services/file-db.ts");

const storage = Storage();
const bucketName =
  process.env.NODE_ENV === "production"
    ? "tangle-prod-bulk-import"
    : "tangle-dev-bulk-import";

export function save(urn: SessionUrn, file): Promise<void> {
  const userId = getAuthenticatedUser().urn;
  const dest = `users/${userId.toRaw()}/${urn.toRaw()}`;
  return writeToDb(dest, file);
}

function writeToDb(dest: string, file): Promise<void> {
  const remoteFile = storage.bucket(bucketName).file(dest);
  return remoteFile
    .save(file.buffer, {
      metadata: {
        contentType: file.mimetype
      },
      resumable: false
    })
    .catch(err => {
      LOGGER.error(err);
    });
}
