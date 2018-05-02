import { executeQuery } from "../../db/db";
import { getAuthenticatedUser } from "../../filters/request-context";

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<string[]> {
  const userId = getAuthenticatedUser().id;
  const rewrittenQuery = `${rawQuery}~`;
  const params = { rewrittenQuery, userId, start, count };
  const query = `CALL apoc.index.search("captures", {rewrittenQuery}) YIELD node as c, weight
    MATCH (c:Capture)<-[created:CREATED]-(u:User {id:{userId}})
    WHERE NOT EXISTS (c.archived) OR c.archived = false
    WITH c
    SKIP {start} LIMIT {count}
    RETURN c.id as captureId
  `;
  return executeQuery(query, params).then(res => {
    return res.records.map(record => record.get("captureId"));
  });
}
