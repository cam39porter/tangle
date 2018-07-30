import * as xss from "xss";
import { getRequestContext } from "../../filters/request-context";
import { createCapturedLink as createCapturedLinkDB } from "../../db/services/captured-link";

const xssOptions = { whiteList: xss.whiteList };
const capturedLinkXSS = new xss.FilterXSS(xssOptions);

export function createCapturedLink({
  title,
  url,
  content,
  byline,
  length,
  comment
}): Promise<string> {
  const userUrn = getRequestContext().loggedInUser.urn;
  return createCapturedLinkDB(
    userUrn,
    capturedLinkXSS.process(title),
    capturedLinkXSS.process(url),
    capturedLinkXSS.process(content),
    capturedLinkXSS.process(byline),
    length,
    capturedLinkXSS.process(comment)
  ).then(capturedLink => capturedLink.urn.toRaw());
}
