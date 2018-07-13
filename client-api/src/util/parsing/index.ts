import * as unified from "unified";
import * as parse from "rehype-parse";
import * as toString from "hast-util-to-string";
import * as toHtml from "hast-util-to-html";
import { concat, flatten } from "lodash";

const MIN_CHUNK_SIZE = 500; // characters

export interface Position {
  line: number;
  column: number;
  offset: number;
}

export class Chunk {
  public html: string;
  public start: Position;
  public end: Position;
  constructor(html: string, start: Position, end: Position) {
    this.html = html;
    this.start = start;
    this.end = end;
  }
}

const parseChunks = (node: any, chunks: Chunk[]) => {
  let children = node.children;
  if (children) {
    const newChunks = children.map(childNode => {
      const childText = toString(childNode);
      const childLength = childText.length;
      if (childLength === 0) {
        return chunks;
      }
      return childLength < MIN_CHUNK_SIZE
        ? [
            new Chunk(
              toHtml(childNode),
              childNode.position.start,
              childNode.position.end
            )
          ]
        : parseChunks(childNode, chunks);
    });
    chunks = concat(chunks, newChunks);
  } else {
    chunks = concat(
      chunks,
      new Chunk(toHtml(node), node.position.start, node.position.end)
    );
  }
  return flatten(chunks);
};

export const chunkHtml = (html: string): Chunk[] => {
  let tree = unified()
    .use(parse)
    .parse(html);

  return parseChunks(tree, []);
};
