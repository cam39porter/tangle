import * as Storage from "@google-cloud/storage";
import { getAuthenticatedUser } from "../../filters/request-context";
import { Logger } from "../../util/logging/logger";
import { SessionUrn } from "../../urn/session-urn";
import { UserUrn } from "../../urn/user-urn";
import { ReadStream } from "fs";

const LOGGER = new Logger("src/upload/services/file-db.ts");

const storage = Storage();
const bucketName =
  process.env.NODE_ENV === "production"
    ? "tangle-prod-bulk-import"
    : "tangle-dev-bulk-import";

export function deleteFile(
  userUrn: UserUrn,
  sessionUrn: SessionUrn
): Promise<void> {
  const dest = buildDest(userUrn, sessionUrn);
  return storage
    .bucket(bucketName)
    .file(dest)
    .delete()
    .then(() => {
      LOGGER.info(`File deleted at location ${dest}`);
    })
    .catch(err => {
      LOGGER.error(`Failed to delete file at location ${dest}`);
      LOGGER.error(err);
    });
}

export function getFile(userUrn: UserUrn, sessionUrn: SessionUrn): ReadStream {
  const dest = buildDest(userUrn, sessionUrn);
  return storage
    .bucket(bucketName)
    .file(dest)
    .createReadStream();
}

export function save(urn: SessionUrn, file): Promise<void> {
  const userId = getAuthenticatedUser().urn;
  const dest = buildDest(userId, urn);
  return writeToDb(dest, file);
}

function buildDest(userUrn: UserUrn, sessionUrn: SessionUrn): string {
  return `users/${userUrn.toRaw()}/${sessionUrn.toRaw()}`;
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
