import { executeQuery, Param } from "../db";
import { getRequestContext } from "../../filters/request-context";

export function create(body: string): Promise<boolean> {
  const userId = getRequestContext().user.urn;
  const params = [new Param("userId", userId.toRaw()), new Param("body", body)];
  const query = `
    CREATE (feedback:AppFeedback {
      body: {body},
      owner: {userId},
      created: TIMESTAMP()
    })
    RETURN feedback`;
  return executeQuery(query, params).then(() => {
    return true;
  });
}
