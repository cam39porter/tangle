import * as cheerio from "cheerio";
import { EvernoteUpload } from "../models/evernote-upload";

export function parseEvernoteHtml(data): EvernoteUpload {
  const $ = cheerio.load(data);
  const tagString = $("meta[name=keywords]").attr("content");
  const tags = tagString ? tagString.split(", ") : [];
  const title = $("title").text();
  const created = Date.parse(
    $("meta[name=created]")
      .attr("content")
      .slice(0, -5)
  );
  const lastModified = Date.parse(
    $("meta[name=updated]")
      .attr("content")
      .slice(0, -5)
  );

  const bodyHtml = $("body").html();

  return new EvernoteUpload(created, lastModified, tags, title, bodyHtml);
}
