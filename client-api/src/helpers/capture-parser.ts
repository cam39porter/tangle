// TODO unit test this method
function parseTags(str: string): string[] {
  const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
  const ret = [];
  let match;
  while ((match = regex.exec(str))) {
    ret.push(match[1]);
  }
  return ret;
}

function stripTags(str: string): string {
  const regexp = new RegExp("#([^\\s]*)", "g");
  return str.replace(regexp, "");
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
export { parseTags, stripTags, parseLinks };
