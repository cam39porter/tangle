import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery } from "../db";
import { User } from "../models/user";

export function createUser(user: User) {
  return executeQuery(`
  MERGE (u:User {
    id:"${user.id}",
    name:"${user.name}",
    email:"${user.email}"
  })
  ON CREATE SET u.created=TIMESTAMP()
  RETURN u`);
}

export function getUser(urn: string): Promise<User> {
  return executeQuery(`
  MATCH (u:User {id:"${urn}"})
  RETURN u`).then((result: StatementResult) => {
    return result.records[0].get("u").properties as User;
  });
}
