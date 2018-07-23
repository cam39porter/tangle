import {
  getCapture as getCaptureClient,
  getCapturesByRelatedNode,
  getMostRecent,
  getUntypedNode
} from "../../db/services/capture";
import { getAuthenticatedUser } from "../../filters/request-context";
import { SurfaceResults } from "../models/surface-results";
import { expandCaptures } from "./expand";
import { formatCapture, formatNode } from "../formatters/graph-node";
import { CaptureUrn } from "../../urn/capture-urn";
import { Urn } from "../../urn/urn";
import { PagingContext } from "../models/paging-context";
import { transformFromCountPlusOne } from "../../helpers/page";
import { CollectionResult } from "../models/collection-result";
import { Capture } from "../../db/models/capture";

export function getNode(urn: Urn): Promise<SurfaceResults> {
  if (CaptureUrn.isCaptureUrn(urn)) {
    return getCapture(CaptureUrn.fromUrn(urn));
  } else {
    return getOthers(urn);
  }
}

export function getAllMostRecent(
  pagingContext: PagingContext
): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().urn;
  return getMostRecent(
    userUrn,
    parseFloat(pagingContext.pageId),
    pagingContext.count
  ).then(captures => {
    const captureUrns = captures.map(c => c.urn);
    return expandCaptures(userUrn, captureUrns, null);
  });
}

export function getMostRecentCaptures(
  pagingContext: PagingContext
): Promise<CollectionResult<Capture>> {
  const userUrn = getAuthenticatedUser().urn;
  const start = parseFloat(pagingContext.pageId);
  return getMostRecent(userUrn, start, pagingContext.count + 1).then(
    captures => {
      return transformFromCountPlusOne(
        captures,
        pagingContext,
        (start + pagingContext.count).toString()
      );
    }
  );
}

function getOthers(urn: Urn): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().urn;
  return getUntypedNode(userUrn, urn).then(node => {
    return getCapturesByRelatedNode(userUrn, urn).then(captures => {
      return expandCaptures(
        userUrn,
        captures.map(c => c.urn),
        formatNode(node)
      );
    });
  });
}

function getCapture(urn: CaptureUrn): Promise<SurfaceResults> {
  const userUrn = getAuthenticatedUser().urn;
  return getCaptureClient(userUrn, urn).then(capture =>
    expandCaptures(userUrn, [capture.urn], formatCapture(capture, true, []))
  );
}
