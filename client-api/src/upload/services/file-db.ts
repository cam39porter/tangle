const Storage = require("@google-cloud/storage");

const storage = new Storage();

const bucketName = "evernote-upload";
export function save(file): Promise<void> {
  // TODO impl
  return Promise.resolve(null);
}
