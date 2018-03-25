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

export { parseTags };
