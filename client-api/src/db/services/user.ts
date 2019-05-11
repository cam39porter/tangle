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
    WITH u
    OPTIONAL MATCH (u)-[:HAS_FULL_READ_PERMISSION]->(other:User)
    RETURN u, collect(other) as others`;
  return executeQuery(query, params).then(formatUser);
}

function isUserWhitelisted(email: string): Promise<boolean> {
  return Promise.resolve(true);
}

export function getUser(urn: UserUrn): Promise<User> {
  const params = [new Param("urn", urn.toRaw())];
  const query = `
    MATCH (u:User {id:{urn}})
    OPTIONAL MATCH (u)-[:HAS_FULL_READ_PERMISSION]->(other:User)
    RETURN u, collect(other) as others`;
  return executeQuery(query, params).then(formatUser);
}

function formatUser(result: StatementResult): User {
  const props = result.records[0].get("u").properties;
  const userUrn = UserUrn.fromRaw(props["id"]);
  const others = result.records[0].get("others") || [];
  const canReadUrns = others.map(node =>
    UserUrn.fromRaw(node.properties["id"])
  );
  canReadUrns.push(userUrn);
  return new User(userUrn, props["email"], props["name"], canReadUrns);
}
