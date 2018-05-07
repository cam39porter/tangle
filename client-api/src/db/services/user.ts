import { StatementResult } from "neo4j-driver/types/v1";
import { executeQuery } from "../db";
import { User } from "../models/user";

export function createUser(user: User): Promise<User> {
  const params = {
    id: user.id,
    name: user.name,
    email: user.email
  };
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

export function getUser(urn: string): Promise<User> {
  const params = { urn };
  const query = `
    MATCH (u:User {id:{urn}})
    RETURN u`;
  return executeQuery(query, params).then(formatUser);
}

function formatUser(result: StatementResult): User {
  return result.records[0].get("u").properties as User;
}
