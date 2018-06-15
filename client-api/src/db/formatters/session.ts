import { Session } from "../models/session";
import { CollectionResult } from "../../surface/models/collection-result";
import { PagingInfo } from "../../surface/models/paging-info";
import { formatBasicCapture } from "./capture";
import { Node } from "neo4j-driver/types/v1";
import { PagingContext } from "../../surface/models/paging-context";

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
  session.itemCollection = new CollectionResult(
    captures,
    new PagingInfo((start + itemsPagingContext.count).toString(), totalCaptures)
  );
  return session;
}
