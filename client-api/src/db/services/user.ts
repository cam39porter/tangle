import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery, Param } from "../db";
import { User } from "../models/user";
import { UserUrn } from "../../urn/user-urn";
import { NotWhitelistedError } from "../../util/exceptions/not-whitelisted-error";

export function mergeUser(user: User): Promise<User> {
  return isUserWhitelisted(user.email).then(bool => {
    if (bool) {
      return doMerge(user);
    } else {
      throw new NotWhitelistedError(`${user.email} is not whitelisted`);
    }
  });
}

function doMerge(user: User): Promise<User> {
  const params = [
    new Param("id", user.urn.toRaw()),
    new Param("name", user.name),
    new Param("email", user.email)
  ];
  const query = `
    MERGE (u:User {
      id:{id},
      name:{name},
      email:{email}
    })
    ON CREATE SET u.created=TIMESTAMP()
    RETURN u`;
  return executeQuery(query, params).then(formatUser);
}

function isUserWhitelisted(email: string): Promise<boolean> {
  const params = [new Param("email", email)];
  const query = `
    MATCH (u:WhitelistedEmail {email:{email}})
    RETURN u`;
  return executeQuery(query, params).then(res => {
    return res.records.length > 0;
  });
}

export function getUser(urn: UserUrn): Promise<User> {
  const params = [new Param("urn", urn.toRaw())];
  const query = `
    MATCH (u:User {id:{urn}})
    RETURN u`;
  return executeQuery(query, params).then(formatUser);
}

function formatUser(result: StatementResult): User {
  const props = result.records[0].get("u").properties;
  return new User(UserUrn.fromRaw(props["id"]), props["email"], props["name"]);
}
