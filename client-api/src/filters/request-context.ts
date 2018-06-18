import { User } from "../db/models/user";
import { createNamespace, getNamespace } from "continuation-local-storage";

export class RequestContext {
  public user: User;

  constructor(user: User) {
    this.user = user;
  }
}

export function setAuthenticatedUser(user: User, next: any): void {
  const session = getNamespace("request")
    ? getNamespace("request")
    : createNamespace("request");
  session.run(() => {
    session.set("user", user);
    next();
  });
}

export function hasAuthenticatedUser(): boolean {
  const session = getNamespace("request");
  return session && session.active ? true : false;
}

export function getAuthenticatedUser(): User {
  const session = getNamespace("request");
  const userJson = session.get("user");
  if (!userJson) {
    throw new Error("Authenticated user has not yet been set. Cannot proceed");
  }
  return userJson as User;
}

export function getContext(): RequestContext {
  return new RequestContext(getAuthenticatedUser());
}
