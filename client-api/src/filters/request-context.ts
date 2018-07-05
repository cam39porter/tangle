import { User } from "../db/models/user";
import * as contextService from "request-context";
import { v4 as uuidv4 } from "uuid/v4";

export class RequestContext {
  public user: User;
  public reqId: string;
  constructor(user: User) {
    this.user = user;
    this.reqId = uuidv4();
  }
}

export function setReqeustContext(user: User): void {
  const req = new RequestContext(user);
  contextService.set("request", req);
}

export function hasAuthenticatedUser(): boolean {
  return contextService.get("request:user");
}

export function getAuthenticatedUser(): User {
  const userJson = contextService.get("request:user");
  if (!userJson) {
    throw new Error("Authenticated user has not yet been set. Cannot proceed");
  }
  return userJson as User;
}

export function getRequestContext(): RequestContext {
  return contextService.get("request") as RequestContext;
}
