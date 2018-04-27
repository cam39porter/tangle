import { EvernoteNote } from "../models/evernote-note";
import { toEvernoteNoteUrn } from "../../helpers/urn-helpers";
import * as cheerio from "cheerio";
import * as moment from "moment";

export function parseEvernoteHtml(data): EvernoteNote {
  const $ = cheerio.load(data);
  const tags = $("meta[name=keywords]")
    .attr("content")
    .split(", ");
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
    .filter((i, element) => {
      return !isBreak(element);
    })
    .map((i, element) => {
      return getData($, element);
    })
    .toArray()
    .map(element => {
      return element.toString();
    });

  return new EvernoteNote(
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
