import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery, Param } from "../db";
import { User } from "../models/user";
import { UserUrn } from "../../urn/user-urn";

export function createUser(user: User): Promise<User> {
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
