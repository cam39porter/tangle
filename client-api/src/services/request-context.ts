import * as requestContext from "request-context";
import { User } from "../models";

function setAuthenticatedUser(user: User) {
  requestContext.set("request:user", user);
}

function getAuthenticatedUser(): User {
  const userJson = requestContext.get("request:user");
  if (!userJson) {
    throw new Error("Authenticated user has not yet been set. Cannot proceed");
  }
  return userJson as User;
}

export { setAuthenticatedUser, getAuthenticatedUser };
