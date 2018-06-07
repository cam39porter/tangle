import { executeQuery } from "../../db/db";
import { getAuthenticatedUser } from "../../filters/request-context";

export function search(
  rawQuery: string,
  start: number,
  count: number
): Promise<string[]> {
  const userId = getAuthenticatedUser().id;
  const params = { rawQuery, userId, start, count };
  const query = `CALL ga.es.queryNode('{"query":{"bool":{
    "must":{"match":{"body":"${rawQuery}"}},
    "filter":{"match":{"owner":"${userId}"}},
    "must_not":{"match":{"archived":"true"}}

  }}}')
   YIELD node RETURN node.id as captureId
  `.replace(/\r?\n|\r/g, "");
  return executeQuery(query, params).then(res => {
    return res.records.map(record => record.get("captureId"));
  });
}
