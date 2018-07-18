import { getSessionStorageUsed } from "../../db/services/session";
import { getRequestContext } from "../../filters/request-context";
import { Settings } from "../models/settings";

export function getStorageUsed(): Promise<Settings> {
  const userUrn = getRequestContext().user.urn;
  return getSessionStorageUsed(userUrn).then(
    storageUsed => new Settings(storageUsed)
  );
}
