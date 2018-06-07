function parseTags(str: string): string[] {
  const regexp = new RegExp("#([^\\s]*)", "g");
  const ret = [];
  let match;
  while ((match = regexp.exec(str))) {
    ret.push(match[1]);
  }
  return ret;
}

function stripTags(str: string): string {
  const regexp = new RegExp("#([^\\s]*)", "g");
  return str.replace(regexp, "").trim();
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
