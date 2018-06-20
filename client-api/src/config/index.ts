import { Logger } from "../util/logging/logger";
import * as Storage from "@google-cloud/storage";

const LOGGER = new Logger("src/config/index.ts");
const NODE_ENV = process.env.NODE_ENV;

export function isProd(): boolean {
  return NODE_ENV === "production";
}

export function isDev(): boolean {
  return NODE_ENV === "development";
}

export function isLocal(): boolean {
  return NODE_ENV === "local";
}

let config = null;

export function getConfig(): object {
  return config;
}

export function bootConfigs(): Promise<void> {
  const storage = Storage();
  const bucketName = isProd() ? "tangle-prod-config" : "tangle-dev-config";
  const fileName = "config.json";
  const remoteFile = storage.bucket(bucketName).file(fileName);

  return remoteFile
    .download()
    .then(contents => {
      LOGGER.info(null, "Successfully loaded configs");
      config = JSON.parse(contents.toString());
    })
    .catch(err => {
      LOGGER.error(null, "Failed to load configs. TIME TO BLOWUP!!!");
      LOGGER.error(null, err);
      process.exit(1);
    });
}
