import { setRequestContext } from "./request-context";
import { User } from "../db/models/user";
import { UserUrn } from "../urn/user-urn";

function authFilter(_1, _2, next): void {
  setRequestContext(
    new User(new UserUrn("1"), "testemail@usetangle.com", "test user", [])
  );
  next();
}

export { authFilter };
