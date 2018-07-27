import { CapturedLinkUrn } from "../../urn/captured-link-urn";

export class CapturedLink {
  public urn: CapturedLinkUrn;
  public title: string;
  public url: string;
  public content: string;
  public created: number;
  public lastModified: number;
  public byline: string | null;
  public length: number | null;

  constructor(
    urn: CapturedLinkUrn,
    title: string,
    url: string,
    content: string,
    created: number,
    lastModified: number,
    byline: string | null,
    length: number | null
  ) {
    this.urn = urn;
    this.title = title;
    this.url = url;
    this.content = content;
    this.created = created;
    this.lastModified = lastModified;
    this.byline = byline;
    this.length = length;
  }
}
