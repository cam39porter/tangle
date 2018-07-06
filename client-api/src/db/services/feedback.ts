import { executeQuery, Param } from "../db";
import { v4 as uuidv4 } from "uuid/v4";
import { getRequestContext } from "../../filters/request-context";

export function create(body: string): Promise<boolean> {
  const uuid = uuidv4();
  const userId = getRequestContext().user.urn;
  const params = [
    new Param("userId", userId.toRaw()),
    new Param("id", uuid),
    new Param("body", body)
  ];
  const query = `
    CREATE (feedback:AppFeedback {
      id: {id},
      body: {body},
      owner: {userId},
      created: TIMESTAMP()
    })
    RETURN feedback`;
  return executeQuery(query, params).then(() => {
    return true;
  });
}
