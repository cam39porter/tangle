import * as cheerio from "cheerio";
import { EvernoteUpload } from "../models/evernote-upload";

export function parseEvernoteHtml(data: string): EvernoteUpload {
  const $ = cheerio.load(data);
  const tagString = $("meta[name=keywords]").attr("content");
  const tags = tagString ? tagString.split(", ") : [];
  const title = $("title").text();
  const createdHtml = $("meta[name=created]").attr("content");
  const created = createdHtml
    ? Date.parse(createdHtml.slice(0, -5))
    : Date.now();
  const lastModifiedHtml = $("meta[name=updated]").attr("content");
  const lastModified = lastModifiedHtml
    ? Date.parse(lastModifiedHtml.slice(0, -5))
    : Date.now();

  const bodyHtml = $("body").html();

  return new EvernoteUpload(created, lastModified, tags, title, bodyHtml);
}
