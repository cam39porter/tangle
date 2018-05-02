import * as cheerio from "cheerio";
import { toEvernoteNoteUrn } from "../../helpers/urn-helpers";
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
  const contents: string[] = $("body div")
    .filter((_, element) => {
      return !isBreak(element);
    })
    .map((_, element) => {
      return getData($, element);
    })
    .toArray()
    .map(element => {
      return element.toString();
    });

  return new EvernoteUpload(
    toEvernoteNoteUrn(
      `${created.toString()};${$("meta[name=author]").attr("content")}`
    ),
    created,
    lastModified,
    tags,
    title,
    contents
  );
}

function isBreak(element: CheerioElement): boolean {
  return element.firstChild.name && element.firstChild.name === "br";
}

function getData($, element: CheerioElement): string {
  return $.html(element.firstChild);
}
