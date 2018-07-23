import { getSessionStorageUsed } from "../../db/services/session";
import { getRequestContext } from "../../filters/request-context";
import { Settings } from "../models/settings";

const MAX_STORAGE_PER_USER = 100 * 1000 * 1000; // 100 MB

export function getStorageUsed(): Promise<Settings> {
  const userUrn = getRequestContext().loggedInUser.urn;
  return getSessionStorageUsed(userUrn).then(
    storageUsed => new Settings(storageUsed)
  );
}

export function hasAvailableStorage(): Promise<boolean> {
  return getStorageUsed().then(
    settings => settings.storageUsed < MAX_STORAGE_PER_USER
  );
}
