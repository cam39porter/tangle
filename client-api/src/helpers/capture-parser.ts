const hashtagRegex = new RegExp("#([^\\s<]*)", "g");

function parseTags(str: string): string[] {
  const ret = [];
  let match;
  while ((match = hashtagRegex.exec(str))) {
    ret.push(match[1]);
  }
  return ret;
}

function stripTags(str: string): string {
  return str.replace(hashtagRegex, "").trim();
}

function parseLinks(str: string): string[] {
  const regex = /(https?:\/\/[^\s]+)/g;
  const ret = [];
  let match;
  while ((match = regex.exec(str))) {
    ret.push(match[1]);
  }
  return ret;
}

function escape(text: string): string {
  return text.replace(/\"/g, '\\"');
}

export { escape, parseTags, stripTags, parseLinks };
