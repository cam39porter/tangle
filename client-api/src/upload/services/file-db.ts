import * as Storage from "@google-cloud/storage";
import { getAuthenticatedUser } from "../../filters/request-context";
import { ConflictError } from "../../util/exceptions/confict-error";

const storage = Storage();
const bucketName =
  process.env.NODE_ENV === "production"
    ? "tangle-prod-bulk-import"
    : "tangle-dev-bulk-import";

export function saveOverwrite(id: string, file): Promise<void> {
  const userId = getAuthenticatedUser().id;
  const dest = `users/${userId}/${id}`;
  return writeToDb(dest, file);
}

export function saveSafely(id: string, file): Promise<void> {
  const userId = getAuthenticatedUser().id;
  const dest = `users/${userId}/${id}`;
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
      console.log(`${file} uploaded to ${bucketName}.`);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}
