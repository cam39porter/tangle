import { Session } from "../models/session";
import { formatBasicCapture } from "./capture";
import { Node } from "neo4j-driver/types/v1";
import { PagingContext } from "../../surface/models/paging-context";
import { transformFromCountPlusOne } from "../../helpers/page";

export function formatBasicSession(sessionRecord: Node): Session {
  const session = Session.fromProperties(sessionRecord.properties);
  return session;
}

export function formatSessionWithCaptures(
  sessionRecord: Node,
  captureRecords: Node[],
  totalCaptures: number,
  itemsPagingContext?: PagingContext
): Session {
  const session = formatBasicSession(sessionRecord);
  const captures = captureRecords.map(capture => formatBasicCapture(capture));
  const start = itemsPagingContext.pageId
    ? parseInt(itemsPagingContext.pageId, 10)
    : 0;
  session.itemCollection = transformFromCountPlusOne(
    captures,
    itemsPagingContext,
    (start + itemsPagingContext.count).toString(),
    totalCaptures
  );
  return session;
}
