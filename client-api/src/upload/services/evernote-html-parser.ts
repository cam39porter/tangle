import * as cheerio from "cheerio";
import * as h2p from "html2plaintext";
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

  const contents = parseBody($("body").html());

  return new EvernoteUpload(created, lastModified, tags, title, contents);
}

function parseBody(html: string): string[] {
  const noDivs = html.replace(/(<div>|<\/div>)/gi, "</br>");
  const lines = h2p(noDivs).split("\n");
  const noEmpties = lines.filter(line => line !== "");
  const contents = [];
  noEmpties.forEach(element => {
    if (isLetter(element.substring(0, 1))) {
      contents.push(element);
    } else {
      if (contents.length === 0) {
        contents.push(element);
      } else {
        contents[contents.length - 1] += `\n${element}`;
      }
    }
  });
  return contents;
}

function isLetter(str): boolean {
  return str.length === 1 && str.match(/[a-z]/i);
}
